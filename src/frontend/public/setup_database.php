<?php
// ============================================================
// Abdullah Hosen Portfolio - One-Time Database Setup Script
// URL: https://yoursite.com/md-abdullah-hosen/setup_database.php?key=setup_ridoy_2024
// DELETE THIS FILE from the server after running it once!
// ============================================================

// Security: Only run if correct secret key is provided
if (!isset($_GET['key']) || $_GET['key'] !== 'setup_ridoy_2024') {
    http_response_code(403);
    echo '<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem"><h1>403 Forbidden</h1><p>Access denied. Provide the correct setup key in the URL.</p></body></html>';
    exit();
}

$results    = [];
$connected  = false;
$connectMsg = '';

// ============================================================
// Database Connection
// CRITICAL: All credentials defined here as local variables.
// port=3306 explicit in DSN to avoid socket lookup on CGI hosts.
// ============================================================
try {
    $host     = 'sdb-84.hosting.stackcp.net';
    $dbname   = 'md-abdullah-hosen-35303936a114';
    $username = 'md-abdullah-hosen-35303936a114';
    $password = 'md-abdullah-hosen-35303';
    $charset  = 'utf8mb4';

    $dsn = "mysql:host={$host};port=3306;dbname={$dbname};charset={$charset}";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
    ]);

    $connected  = true;
    $connectMsg = 'Connected to ' . htmlspecialchars($host) . ' — database: ' . htmlspecialchars($dbname);

    // ---- Helper ----
    $run = function (string $label, string $sql) use ($pdo, &$results): void {
        try {
            $pdo->exec($sql);
            $results[] = ['label' => $label, 'success' => true, 'message' => 'OK — created or already exists'];
        } catch (PDOException $e) {
            $results[] = ['label' => $label, 'success' => false, 'message' => $e->getMessage()];
        }
    };

    // ---- TABLE: projects ----
    // image_urls stores a JSON array of PERMANENT server file paths.
    // Example: ["/md-abdullah-hosen/uploads/1234_abc.jpg"]
    // Blob URLs (blob:...) are NEVER stored here — they are browser-session-only.
    $run('Table: projects', "
        CREATE TABLE IF NOT EXISTS projects (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            title       VARCHAR(255) NOT NULL,
            description TEXT,
            category    VARCHAR(100),
            image_urls  LONGTEXT COMMENT 'JSON array of permanent /uploads/ URL paths',
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // ---- TABLE: contacts ----
    $run('Table: contacts', "
        CREATE TABLE IF NOT EXISTS contacts (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            name       VARCHAR(255) NOT NULL,
            email      VARCHAR(255) NOT NULL,
            subject    VARCHAR(255),
            message    TEXT,
            service    VARCHAR(255),
            is_read    TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // ---- TABLE: admins ----
    $run('Table: admins', "
        CREATE TABLE IF NOT EXISTS admins (
            id            INT AUTO_INCREMENT PRIMARY KEY,
            username      VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // ---- TABLE: admin_sessions ----
    // username column is included for audit purposes.
    $run('Table: admin_sessions', "
        CREATE TABLE IF NOT EXISTS admin_sessions (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            token      VARCHAR(64) NOT NULL UNIQUE,
            username   VARCHAR(100) DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME NOT NULL,
            INDEX idx_token (token)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // ---- Try to add username column if table already existed without it ----
    try {
        $pdo->exec("ALTER TABLE admin_sessions ADD COLUMN username VARCHAR(100) DEFAULT NULL AFTER token");
        $results[] = ['label' => 'Migration: admin_sessions.username', 'success' => true, 'message' => 'Column added'];
    } catch (PDOException $e) {
        // Column already exists — that's fine
        if (strpos($e->getMessage(), 'Duplicate column') !== false || strpos($e->getMessage(), 'already exists') !== false) {
            $results[] = ['label' => 'Migration: admin_sessions.username', 'success' => true, 'message' => 'Column already exists — OK'];
        }
        // Other errors are silently ignored here
    }

    // ---- Seed default admin: ridoy / Ridoy@2024 ----
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = ?");
        $stmt->execute(['ridoy']);
        $exists = (int)$stmt->fetchColumn();

        if ($exists === 0) {
            $hash = password_hash('Ridoy@2024', PASSWORD_DEFAULT);
            $ins  = $pdo->prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)");
            $ins->execute(['ridoy', $hash]);
            $results[] = ['label' => 'Admin seed: ridoy', 'success' => true, 'message' => 'Admin account created (ridoy / Ridoy@2024)'];
        } else {
            $results[] = ['label' => 'Admin seed: ridoy', 'success' => true, 'message' => 'Already exists — no changes made'];
        }
    } catch (PDOException $e) {
        $results[] = ['label' => 'Admin seed: ridoy', 'success' => false, 'message' => $e->getMessage()];
    }

    // ---- Create uploads/ directory ----
    $uploadsDir = __DIR__ . '/uploads';
    if (!is_dir($uploadsDir)) {
        if (mkdir($uploadsDir, 0755, true)) {
            $results[] = ['label' => 'Directory: uploads/', 'success' => true, 'message' => 'Created with permissions 0755'];
        } else {
            $results[] = ['label' => 'Directory: uploads/', 'success' => false, 'message' => 'Failed to create — check server permissions'];
        }
    } else {
        $results[] = ['label' => 'Directory: uploads/', 'success' => true, 'message' => 'Already exists'];
    }

    // ---- Secure uploads/ with .htaccess ----
    $htaccessPath = $uploadsDir . '/.htaccess';
    if (!file_exists($htaccessPath)) {
        $htContent = "Options -ExecCGI\nAddHandler cgi-script .php .pl .py .jsp .asp .htm .shtml\nOptions -Indexes\n";
        if (file_put_contents($htaccessPath, $htContent) !== false) {
            $results[] = ['label' => 'Security: uploads/.htaccess', 'success' => true, 'message' => 'Created — PHP execution blocked in uploads/'];
        } else {
            $results[] = ['label' => 'Security: uploads/.htaccess', 'success' => false, 'message' => 'Could not write — check directory permissions'];
        }
    } else {
        $results[] = ['label' => 'Security: uploads/.htaccess', 'success' => true, 'message' => 'Already exists'];
    }

} catch (PDOException $e) {
    $connected  = false;
    $connectMsg = 'Database connection FAILED: ' . $e->getMessage();
}

$allOk = $connected && !in_array(false, array_column($results, 'success'), true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Setup — Abdullah Hosen Portfolio</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f0f0f;
            color: #e5e5e5;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .card {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 2rem;
            max-width: 720px;
            width: 100%;
        }
        h1 { font-size: 1.5rem; margin-bottom: 0.25rem; color: #f5c518; }
        .subtitle { color: #888; font-size: 0.875rem; margin-bottom: 1.5rem; }
        .banner {
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            word-break: break-all;
        }
        .banner-ok  { background: #14532d; border: 1px solid #16a34a; color: #86efac; }
        .banner-err { background: #450a0a; border: 1px solid #dc2626; color: #fca5a5; }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        th {
            text-align: left;
            padding: 0.5rem 0.75rem;
            border-bottom: 1px solid #333;
            color: #888;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
        }
        td { padding: 0.625rem 0.75rem; border-bottom: 1px solid #222; vertical-align: top; }
        tr:last-child td { border-bottom: none; }
        .badge {
            display: inline-block;
            padding: 0.2rem 0.6rem;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 700;
        }
        .badge-ok  { background: #14532d; color: #86efac; }
        .badge-err { background: #450a0a; color: #fca5a5; }
        .warn {
            margin-top: 1.5rem;
            padding: 0.75rem 1rem;
            background: #451a03;
            border: 1px solid #ea580c;
            border-radius: 8px;
            color: #fdba74;
            font-size: 0.85rem;
            line-height: 1.7;
        }
        .warn strong { color: #f97316; }
        .success-box {
            margin-top: 1.5rem;
            padding: 0.75rem 1rem;
            background: #14532d;
            border: 1px solid #16a34a;
            border-radius: 8px;
            color: #86efac;
            font-size: 0.9rem;
            line-height: 1.7;
        }
        code {
            background: #2a2a2a;
            padding: 0.1rem 0.4rem;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
        }
    </style>
</head>
<body>
<div class="card">
    <h1>🛠 Database Setup</h1>
    <p class="subtitle">Abdullah Hosen Portfolio — One-time initialization script</p>

    <div class="banner <?= $connected ? 'banner-ok' : 'banner-err' ?>">
        <?= $connected ? '✅ ' : '❌ ' ?><?= htmlspecialchars($connectMsg) ?>
    </div>

    <?php if ($connected && !empty($results)): ?>
    <table>
        <thead>
            <tr>
                <th>Step</th>
                <th>Status</th>
                <th>Detail</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($results as $r): ?>
            <tr>
                <td><?= htmlspecialchars($r['label']) ?></td>
                <td><span class="badge <?= $r['success'] ? 'badge-ok' : 'badge-err' ?>"><?= $r['success'] ? 'OK' : 'FAIL' ?></span></td>
                <td><?= htmlspecialchars($r['message']) ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <?php endif; ?>

    <?php if ($allOk): ?>
    <div class="success-box">
        ✅ <strong>Setup complete!</strong> All tables created and admin seeded.<br>
        You can now log in at <code>/md-abdullah-hosen/ridoy</code> with:<br>
        Username: <code>ridoy</code> &nbsp;|&nbsp; Password: <code>Ridoy@2024</code><br><br>
        <strong>Image storage:</strong> Project images are uploaded to <code>uploads/</code> and stored as permanent server paths in the database. They will never break on page reload or contact form submission.
    </div>
    <?php endif; ?>

    <div class="warn">
        <strong>⚠️ Important — delete this file now!</strong><br>
        After setup is complete, <strong>delete <code>setup_database.php</code></strong> from your server immediately.
        Leaving it accessible allows anyone with the key to re-run setup.<br><br>
        Change your admin password after the first login for security.
    </div>
</div>
</body>
</html>
