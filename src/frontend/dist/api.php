<?php
// ============================================================
// Abdullah Hosen Portfolio - PHP REST API
// Place this file in public_html alongside the built React app
// ============================================================

// --- CORS Headers ---
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================================
// Helper: Database Connection
// CRITICAL: All variables defined INSIDE the function to avoid
// PHP scope bugs on shared/CGI hosting. port=3306 is explicit.
// ============================================================
function getDB(): PDO {
    $host     = 'sdb-84.hosting.stackcp.net';
    $dbname   = 'md-abdullah-hosen-35303936a114';
    $username = 'md-abdullah-hosen-35303936a114';
    $password = 'md-abdullah-hosen-35303';
    $charset  = 'utf8mb4';

    $dsn = "mysql:host={$host};port=3306;dbname={$dbname};charset={$charset}";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
    ];

    try {
        return new PDO($dsn, $username, $password, $options);
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
        exit();
    }
}

// ============================================================
// Helper: Validate Session Token
// ============================================================
function validateToken(PDO $pdo, ?string $token): bool {
    if (empty($token)) return false;
    $stmt = $pdo->prepare(
        "SELECT id FROM admin_sessions WHERE token = ? AND expires_at > NOW() LIMIT 1"
    );
    $stmt->execute([$token]);
    return $stmt->fetch() !== false;
}

// ============================================================
// Helper: JSON Response
// ============================================================
function respond(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

// ============================================================
// Determine action — supports both GET param and JSON body
// ============================================================
$requestAction = $_GET['action'] ?? $_POST['action'] ?? null;

// ============================================================
// FILE UPLOAD HANDLER
// Multipart requests cannot be read via php://input — handle first
// ============================================================
if ($requestAction === 'upload_image') {
    header('Content-Type: application/json');

    $token = $_POST['token'] ?? $_GET['token'] ?? '';
    try {
        $pdo = getDB();
        if (!validateToken($pdo, $token)) {
            respond(['success' => false, 'error' => 'Unauthorized'], 401);
        }
    } catch (Throwable $e) {
        respond(['success' => false, 'error' => 'Database error: ' . $e->getMessage()], 500);
    }

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        $errCode = $_FILES['image']['error'] ?? 'no_file';
        respond(['success' => false, 'error' => 'No file received or upload error: ' . $errCode], 400);
    }

    $file = $_FILES['image'];

    // 5 MB limit
    if ($file['size'] > 5 * 1024 * 1024) {
        respond(['success' => false, 'error' => 'File size exceeds 5 MB limit'], 400);
    }

    // Validate MIME type via finfo
    $allowedMime = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $finfo    = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedMime, true)) {
        respond(['success' => false, 'error' => 'Invalid file type. Only JPG, PNG, GIF, WEBP allowed.'], 400);
    }

    $extMap = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/gif'  => 'gif',
        'image/webp' => 'webp',
    ];
    $ext = $extMap[$mimeType] ?? 'jpg';

    // Ensure uploads/ directory exists
    $uploadsDir = __DIR__ . '/uploads';
    if (!is_dir($uploadsDir)) {
        mkdir($uploadsDir, 0755, true);
        file_put_contents(
            $uploadsDir . '/.htaccess',
            "Options -ExecCGI\nAddHandler cgi-script .php .pl .py .jsp .asp .htm .shtml\nOptions -Indexes\n"
        );
    }

    $filename = time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $destPath = $uploadsDir . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        respond(['success' => false, 'error' => 'Failed to save file to disk'], 500);
    }

    $url = '/md-abdullah-hosen/uploads/' . $filename;
    respond(['success' => true, 'url' => $url]);
}

// ============================================================
// All other actions — parse JSON body or fall back to GET params
// ============================================================
header('Content-Type: application/json');

// Determine action from JSON body, GET param, or POST param
$data   = [];
$action = null;

$raw = file_get_contents('php://input');
if (!empty($raw)) {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $data   = $decoded;
        $action = $data['action'] ?? null;
    }
}

// Fallback: action via GET/POST (for simple GET requests like get_projects)
if (empty($action)) {
    $action = $requestAction;
}

if (empty($action)) {
    respond(['success' => false, 'error' => 'Missing action parameter'], 400);
}

// Token helper — check JSON body first, then GET/POST
function getToken(array $data): string {
    return $data['token'] ?? $_GET['token'] ?? $_POST['token'] ?? '';
}

try {
    $pdo = getDB();

    switch ($action) {

        // --------------------------------------------------------
        // LOGIN
        // --------------------------------------------------------
        case 'login': {
            $username = trim($data['username'] ?? '');
            $password = $data['password'] ?? '';

            if (empty($username) || empty($password)) {
                respond(['success' => false, 'error' => 'Username and password required'], 400);
            }

            $authenticated = false;

            // Try DB lookup first
            try {
                $stmt = $pdo->prepare("SELECT password_hash FROM admins WHERE username = ? LIMIT 1");
                $stmt->execute([$username]);
                $row = $stmt->fetch();

                if ($row) {
                    $authenticated = password_verify($password, $row['password_hash']);
                } else {
                    // Fallback hardcoded credentials (before setup_database.php runs)
                    if ($username === 'ridoy' && $password === 'Ridoy@2024') {
                        $authenticated = true;
                    }
                }
            } catch (Throwable $e) {
                // If admins table doesn't exist yet, fall back to hardcoded
                if ($username === 'ridoy' && $password === 'Ridoy@2024') {
                    $authenticated = true;
                }
            }

            if (!$authenticated) {
                respond(['success' => false, 'error' => 'Invalid username or password'], 401);
            }

            $token     = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

            try {
                $stmt = $pdo->prepare(
                    "INSERT INTO admin_sessions (token, username, expires_at) VALUES (?, ?, ?)"
                );
                $stmt->execute([$token, $username, $expiresAt]);
            } catch (Throwable $e) {
                // If admin_sessions table doesn't exist yet, try without username column
                try {
                    $stmt = $pdo->prepare(
                        "INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)"
                    );
                    $stmt->execute([$token, $expiresAt]);
                } catch (Throwable $e2) {
                    // Session storage failed — still return token (stateless fallback)
                }
            }

            respond(['success' => true, 'token' => $token]);
        }

        // --------------------------------------------------------
        // VALIDATE TOKEN
        // Returns: {success: true, valid: true} if valid
        //          {success: true, valid: false} if invalid/expired
        // --------------------------------------------------------
        case 'validate_token': {
            $token = getToken($data);
            $valid = validateToken($pdo, $token);
            respond(['success' => true, 'valid' => $valid]);
        }

        // --------------------------------------------------------
        // LOGOUT
        // --------------------------------------------------------
        case 'logout': {
            $token = getToken($data);
            if (!empty($token)) {
                try {
                    $stmt = $pdo->prepare("DELETE FROM admin_sessions WHERE token = ?");
                    $stmt->execute([$token]);
                } catch (Throwable $e) {
                    // ignore
                }
            }
            respond(['success' => true]);
        }

        // --------------------------------------------------------
        // GET PROJECTS (public — no auth required)
        // Images are stored as JSON array of permanent server URLs.
        // These never expire because they are real file paths.
        // --------------------------------------------------------
        case 'get_projects': {
            $stmt = $pdo->query(
                "SELECT id, title, description, category, image_urls, created_at
                 FROM projects
                 ORDER BY created_at DESC"
            );
            $rows = $stmt->fetchAll();

            $projects = array_map(function ($row) {
                $imageUrls = [];
                if (!empty($row['image_urls'])) {
                    $decoded   = json_decode($row['image_urls'], true);
                    // Filter out any blob: URLs that may have been saved accidentally
                    if (is_array($decoded)) {
                        $imageUrls = array_values(array_filter($decoded, function($url) {
                            return !empty($url) && strpos($url, 'blob:') !== 0;
                        }));
                    }
                }
                return [
                    'id'          => (int)$row['id'],
                    'title'       => $row['title'],
                    'description' => $row['description'] ?? '',
                    'category'    => $row['category'] ?? '',
                    'imageUrls'   => $imageUrls,
                    'createdAt'   => $row['created_at'],
                ];
            }, $rows);

            respond(['success' => true, 'projects' => $projects]);
        }

        // --------------------------------------------------------
        // CREATE PROJECT (auth required)
        // imageUrls must be permanent server paths — blob: URLs are rejected
        // --------------------------------------------------------
        case 'create_project': {
            $token = getToken($data);
            if (!validateToken($pdo, $token)) {
                respond(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            $title       = trim($data['title'] ?? '');
            $description = trim($data['description'] ?? '');
            $category    = trim($data['category'] ?? '');
            $rawUrls     = is_array($data['imageUrls'] ?? null) ? $data['imageUrls'] : [];

            // Reject blob: URLs — only permanent server paths allowed
            $imageUrls = array_values(array_filter($rawUrls, function($url) {
                return !empty($url) && strpos($url, 'blob:') !== 0;
            }));

            if (empty($title)) {
                respond(['success' => false, 'error' => 'Project title is required'], 400);
            }

            $imageUrlsJson = json_encode($imageUrls);
            $stmt = $pdo->prepare(
                "INSERT INTO projects (title, description, category, image_urls) VALUES (?, ?, ?, ?)"
            );
            $stmt->execute([$title, $description, $category, $imageUrlsJson]);
            $newId = (int)$pdo->lastInsertId();

            $stmt = $pdo->prepare("SELECT created_at FROM projects WHERE id = ?");
            $stmt->execute([$newId]);
            $created = $stmt->fetch();

            respond([
                'success' => true,
                'project' => [
                    'id'          => $newId,
                    'title'       => $title,
                    'description' => $description,
                    'category'    => $category,
                    'imageUrls'   => $imageUrls,
                    'createdAt'   => $created['created_at'] ?? date('Y-m-d H:i:s'),
                ],
            ]);
        }

        // --------------------------------------------------------
        // UPDATE PROJECT (auth required)
        // imageUrls must be permanent server paths — blob: URLs are rejected
        // --------------------------------------------------------
        case 'update_project': {
            $token = getToken($data);
            if (!validateToken($pdo, $token)) {
                respond(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            $id          = (int)($data['id'] ?? 0);
            $title       = trim($data['title'] ?? '');
            $description = trim($data['description'] ?? '');
            $category    = trim($data['category'] ?? '');
            $rawUrls     = is_array($data['imageUrls'] ?? null) ? $data['imageUrls'] : [];

            // Reject blob: URLs — only permanent server paths allowed
            $imageUrls = array_values(array_filter($rawUrls, function($url) {
                return !empty($url) && strpos($url, 'blob:') !== 0;
            }));

            if ($id <= 0 || empty($title)) {
                respond(['success' => false, 'error' => 'Valid project id and title required'], 400);
            }

            $imageUrlsJson = json_encode($imageUrls);
            $stmt = $pdo->prepare(
                "UPDATE projects SET title = ?, description = ?, category = ?, image_urls = ? WHERE id = ?"
            );
            $stmt->execute([$title, $description, $category, $imageUrlsJson, $id]);

            respond(['success' => true]);
        }

        // --------------------------------------------------------
        // DELETE PROJECT (auth required)
        // --------------------------------------------------------
        case 'delete_project': {
            $token = getToken($data);
            if (!validateToken($pdo, $token)) {
                respond(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            $id = (int)($data['id'] ?? 0);
            if ($id <= 0) {
                respond(['success' => false, 'error' => 'Valid project id required'], 400);
            }

            $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
            $stmt->execute([$id]);

            respond(['success' => true]);
        }

        // --------------------------------------------------------
        // SUBMIT CONTACT (public — no auth required)
        // Completely independent from project image storage.
        // Submitting a contact form CANNOT affect project images.
        // --------------------------------------------------------
        case 'submit_contact': {
            $name    = trim($data['name'] ?? '');
            $email   = trim($data['email'] ?? '');
            $subject = trim($data['subject'] ?? '');
            $message = trim($data['message'] ?? '');
            $service = trim($data['service'] ?? '');

            if (empty($name) || empty($email) || empty($message)) {
                respond(['success' => false, 'error' => 'Name, email, and message are required'], 400);
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                respond(['success' => false, 'error' => 'Invalid email address'], 400);
            }

            $stmt = $pdo->prepare(
                "INSERT INTO contacts (name, email, subject, message, service) VALUES (?, ?, ?, ?, ?)"
            );
            $stmt->execute([$name, $email, $subject, $message, $service]);
            $newId = (int)$pdo->lastInsertId();

            $stmt = $pdo->prepare("SELECT created_at FROM contacts WHERE id = ?");
            $stmt->execute([$newId]);
            $created = $stmt->fetch();

            respond([
                'success' => true,
                'contact' => [
                    'id'        => $newId,
                    'name'      => $name,
                    'email'     => $email,
                    'subject'   => $subject,
                    'message'   => $message,
                    'service'   => $service,
                    'timestamp' => $created['created_at'] ?? date('Y-m-d H:i:s'),
                ],
            ]);
        }

        // --------------------------------------------------------
        // GET CONTACTS (auth required)
        // --------------------------------------------------------
        case 'get_contacts': {
            $token = getToken($data);
            if (!validateToken($pdo, $token)) {
                respond(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            $stmt = $pdo->query(
                "SELECT id, name, email, subject, message, service, created_at
                 FROM contacts
                 ORDER BY created_at DESC"
            );
            $rows = $stmt->fetchAll();

            $contacts = array_map(function ($row) {
                return [
                    'id'        => (int)$row['id'],
                    'name'      => $row['name'],
                    'email'     => $row['email'],
                    'subject'   => $row['subject'] ?? '',
                    'message'   => $row['message'] ?? '',
                    'service'   => $row['service'] ?? '',
                    'timestamp' => $row['created_at'],
                ];
            }, $rows);

            respond(['success' => true, 'contacts' => $contacts]);
        }

        // --------------------------------------------------------
        // DELETE CONTACT (auth required)
        // --------------------------------------------------------
        case 'delete_contact': {
            $token = getToken($data);
            if (!validateToken($pdo, $token)) {
                respond(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            $id = (int)($data['id'] ?? 0);
            if ($id <= 0) {
                respond(['success' => false, 'error' => 'Valid contact id required'], 400);
            }

            $stmt = $pdo->prepare("DELETE FROM contacts WHERE id = ?");
            $stmt->execute([$id]);

            respond(['success' => true]);
        }

        // --------------------------------------------------------
        // GET DASHBOARD STATS (auth required)
        // --------------------------------------------------------
        case 'get_dashboard_stats': {
            $token = getToken($data);
            if (!validateToken($pdo, $token)) {
                respond(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            $totalProjects = (int)$pdo->query("SELECT COUNT(*) FROM projects")->fetchColumn();
            $totalContacts = (int)$pdo->query("SELECT COUNT(*) FROM contacts")->fetchColumn();

            $stmt = $pdo->query(
                "SELECT DATE(created_at) AS date, COUNT(*) AS count
                 FROM contacts
                 WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                 GROUP BY DATE(created_at)
                 ORDER BY date ASC"
            );
            $contactsPerDay = array_map(function ($row) {
                return ['date' => $row['date'], 'count' => (int)$row['count']];
            }, $stmt->fetchAll());

            $stmt = $pdo->query(
                "SELECT category, COUNT(*) AS count
                 FROM projects
                 GROUP BY category
                 ORDER BY count DESC"
            );
            $projectsByCategory = array_map(function ($row) {
                return [
                    'category' => $row['category'] ?: 'Uncategorized',
                    'count'    => (int)$row['count'],
                ];
            }, $stmt->fetchAll());

            respond([
                'success' => true,
                'stats'   => [
                    'totalProjects'      => $totalProjects,
                    'totalContacts'      => $totalContacts,
                    'contactsPerDay'     => $contactsPerDay,
                    'projectsByCategory' => $projectsByCategory,
                ],
            ]);
        }

        // --------------------------------------------------------
        // DEFAULT: Unknown action
        // --------------------------------------------------------
        default:
            respond(['success' => false, 'error' => 'Unknown action: ' . htmlspecialchars($action)], 400);
    }

} catch (PDOException $e) {
    respond(['success' => false, 'error' => 'Database error: ' . $e->getMessage()], 500);
} catch (Throwable $e) {
    respond(['success' => false, 'error' => 'Server error: ' . $e->getMessage()], 500);
}
