<?php
// ============================================================
// Abdullah Hosen Portfolio - PHP REST API
// Place this file in public_html alongside the built React app
// ============================================================

// --- CORS Headers ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Database Configuration ---
define('DB_HOST', 'sdb-84.hosting.stackcp.net');
define('DB_NAME', 'abdullah-hosen-35303936c10');
define('DB_USER', 'abdullah-hosen-35303936c10');
define('DB_PASS', '2nyq8n1kmo');

// --- Admin Credentials (fallback if admins table is empty) ---
define('ADMIN_USERNAME', 'ridoy');
define('ADMIN_PASSWORD_HASH', password_hash('Ridoy@2024', PASSWORD_BCRYPT));

// ============================================================
// Helper: Database Connection (PDO singleton)
// ============================================================
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    }
    return $pdo;
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
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

// ============================================================
// Main Request Handler
// ============================================================
try {
    $raw  = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!is_array($data) || empty($data['action'])) {
        respond(['success' => false, 'error' => 'Missing or invalid action'], 400);
    }

    $pdo    = getDB();
    $action = $data['action'];

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

            // Check admins table first
            $stmt = $pdo->prepare("SELECT password_hash FROM admins WHERE username = ? LIMIT 1");
            $stmt->execute([$username]);
            $row = $stmt->fetch();

            if ($row) {
                $authenticated = password_verify($password, $row['password_hash']);
            } else {
                // Fallback: hardcoded credentials
                if ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
                    $authenticated = true;
                }
                // Also allow plain comparison for 'Ridoy@2024' in case hash was not seeded
                if (!$authenticated && $username === ADMIN_USERNAME && $password === 'Ridoy@2024') {
                    $authenticated = true;
                }
            }

            if (!$authenticated) {
                respond(['success' => false, 'error' => 'Invalid username or password'], 401);
            }

            // Generate token
            $token     = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

            $stmt = $pdo->prepare(
                "INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)"
            );
            $stmt->execute([$token, $expiresAt]);

            respond(['success' => true, 'token' => $token]);
        }

        // --------------------------------------------------------
        // VALIDATE TOKEN
        // --------------------------------------------------------
        case 'validate_token': {
            $token = $data['token'] ?? '';
            respond(['success' => validateToken($pdo, $token)]);
        }

        // --------------------------------------------------------
        // LOGOUT
        // --------------------------------------------------------
        case 'logout': {
            $token = $data['token'] ?? '';
            if (!empty($token)) {
                $stmt = $pdo->prepare("DELETE FROM admin_sessions WHERE token = ?");
                $stmt->execute([$token]);
            }
            respond(['success' => true]);
        }

        // --------------------------------------------------------
        // GET PROJECTS (public)
        // --------------------------------------------------------
        case 'get_projects': {
            $stmt = $pdo->query(
                "SELECT id, title, description, category, image_urls, created_at FROM projects ORDER BY created_at DESC"
            );
            $rows = $stmt->fetchAll();

            $projects = array_map(function ($row) {
                $imageUrls = [];
                if (!empty($row['image_urls'])) {
                    $decoded = json_decode($row['image_urls'], true);
                    $imageUrls = is_array($decoded) ? $decoded : [];
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
        // --------------------------------------------------------
        case 'create_project': {
            $token = $data['token'] ?? '';
            if (!validateToken($pdo, $token)) {
                respond(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            $title       = trim($data['title'] ?? '');
            $description = trim($data['description'] ?? '');
            $category    = trim($data['category'] ?? '');
            $imageUrls   = is_array($data['imageUrls'] ?? null) ? $data['imageUrls'] : [];

            if (empty($title)) {
                respond(['success' => false, 'error' => 'Project title is required'], 400);
            }

            $imageUrlsJson = json_encode($imageUrls);
            $stmt = $pdo->prepare(
                "INSERT INTO projects (title, description, category, image_urls) VALUES (?, ?, ?, ?)"
            );
            $stmt->execute([$title, $description, $category, $imageUrlsJson]);
            $newId = (int)$pdo->lastInsertId();

            // Fetch the created row
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
        // --------------------------------------------------------
        case 'update_project': {
            $token = $data['token'] ?? '';
            if (!validateToken($pdo, $token)) {
                respond(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            $id          = (int)($data['id'] ?? 0);
            $title       = trim($data['title'] ?? '');
            $description = trim($data['description'] ?? '');
            $category    = trim($data['category'] ?? '');
            $imageUrls   = is_array($data['imageUrls'] ?? null) ? $data['imageUrls'] : [];

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
            $token = $data['token'] ?? '';
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
        // SUBMIT CONTACT (public)
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
            $token = $data['token'] ?? '';
            if (!validateToken($pdo, $token)) {
                respond(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            $stmt = $pdo->query(
                "SELECT id, name, email, subject, message, service, created_at FROM contacts ORDER BY created_at DESC"
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
            $token = $data['token'] ?? '';
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
            $token = $data['token'] ?? '';
            if (!validateToken($pdo, $token)) {
                respond(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            // Total projects
            $totalProjects = (int)$pdo->query("SELECT COUNT(*) FROM projects")->fetchColumn();

            // Total contacts
            $totalContacts = (int)$pdo->query("SELECT COUNT(*) FROM contacts")->fetchColumn();

            // Contacts per day — last 30 days
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

            // Projects by category
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
