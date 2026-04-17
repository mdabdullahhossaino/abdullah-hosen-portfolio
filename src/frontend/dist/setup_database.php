<?php
// ============================================================
// Abdullah Hosen Portfolio - One-Time Database Setup Script
// URL: https://yoursite.com/setup_database.php?key=setup_ridoy_2024
// DELETE OR RENAME THIS FILE after running it once!
// ============================================================

// Security: Only run if correct secret key is provided
$secretKey = 'setup_ridoy_2024';
if (!isset($_GET['key']) || $_GET['key'] !== $secretKey) {
    http_response_code(403);
    echo '<!DOCTYPE html><html><body><h1>403 Forbidden</h1><p>Access denied. Provide the correct setup key.</p></body></html>';
    exit();
}

// --- Database Configuration ---
define('DB_HOST', 'sdb-84.hosting.stackcp.net');
define('DB_NAME', 'abdullah-hosen-35303936c10');
define('DB_USER', 'abdullah-hosen-35303936c10');
define('DB_PASS', '2nyq8n1kmo');

$results = [];

function runSQL(PDO $pdo, string $label, string $sql): array {
    try {
        $pdo->exec($sql);
        return ['label' => $label, 'success' => true, 'message' => 'Created / already exists'];
    } catch (PDOException $e) {
        return ['label' => $label, 'success' => false, 'message' => $e->getMessage()];
    }
}

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // ---- TABLE: projects ----
    $results[] = runSQL($pdo, 'Table: projects', "
        CREATE TABLE IF NOT EXISTS projects (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            title       VARCHAR(255) NOT NULL,
            description TEXT,
            category    VARCHAR(100),
            image_urls  TEXT,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // ---- TABLE: contacts ----
    $results[] = runSQL($pdo, 'Table: contacts', "
        CREATE TABLE IF NOT EXISTS contacts (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            name       VARCHAR(255) NOT NULL,
            email      VARCHAR(255) NOT NULL,
            subject    VARCHAR(255),
            message    TEXT,
            service    VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // ---- TABLE: admin_sessions ----
    $results[] = runSQL($pdo, 'Table: admin_sessions', "
        CREATE TABLE IF NOT EXISTS admin_sessions (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            token      VARCHAR(64) NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME NOT NULL,
            INDEX idx_token (token)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // ---- TABLE: admins (optional, for future multiple admins) ----
    $results[] = runSQL($pdo, 'Table: admins', "
        CREATE TABLE IF NOT EXISTS admins (
            id            INT AUTO_INCREMENT PRIMARY KEY,
            username      VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // ---- Seed default admin (ridoy / Ridoy@2024) if not present ----
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = ?");
    $stmt->execute(['ridoy']);
    $exists = (int)$stmt->fetchColumn();
    if ($exists === 0) {
        $hash = password_hash('Ridoy@2024', PASSWORD_BCRYPT);
        $ins  = $pdo->prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)");
        $ins->execute(['ridoy', $hash]);
        $results[] = ['label' => 'Admin seed: ridoy', 'success' => true, 'message' => 'Admin account created'];
    } else {
        $results[] = ['label' => 'Admin seed: ridoy', 'success' => true, 'message' => 'Already exists'];
    }

    $connected = true;
    $connectMsg = 'Connected to database successfully.';

} catch (PDOException $e) {
    $connected  = false;
    $connectMsg = 'Database connection FAILED: ' . htmlspecialchars($e->getMessage());
}
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
            max-width: 680px;
            width: 100%;
        }
        h1 { font-size: 1.5rem; margin-bottom: 0.25rem; color: #f5c518; }
        .subtitle { color: #888; font-size: 0.875rem; margin-bottom: 1.5rem; }
        .conn-status {
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
        }
        .conn-ok  { background: #14532d; border: 1px solid #16a34a; color: #86efac; }
        .conn-err { background: #450a0a; border: 1px solid #dc2626; color: #fca5a5; }
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
        td { padding: 0.625rem 0.75rem; border-bottom: 1px solid #222; }
        tr:last-child td { border-bottom: none; }
        .badge {
            display: inline-block;
            padding: 0.2rem 0.6rem;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .ok  { background: #14532d; color: #86efac; }
        .err { background: #450a0a; color: #fca5a5; }
        .warn {
            margin-top: 1.5rem;
            padding: 0.75rem 1rem;
            background: #451a03;
            border: 1px solid #ea580c;
            border-radius: 8px;
            color: #fdba74;
            font-size: 0.85rem;
            line-height: 1.6;
        }
        .warn strong { color: #f97316; }
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
    <p class="subtitle">Abdullah Hosen Portfolio — One-time initialization</p>

    <div class="conn-status <?= $connected ? 'conn-ok' : 'conn-err' ?>">
        <?= $connected ? '✅ ' : '❌ ' ?><?= htmlspecialchars($connectMsg) ?>
    </div>

    <?php if ($connected): ?>
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
                <td><span class="badge <?= $r['success'] ? 'ok' : 'err' ?>"><?= $r['success'] ? 'OK' : 'FAIL' ?></span></td>
                <td><?= htmlspecialchars($r['message']) ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <?php endif; ?>

    <div class="warn">
        <strong>⚠️ Security Notice:</strong><br>
        After setup is complete, <strong>delete or rename this file</strong> from your server
        (<code>setup_database.php</code>) to prevent unauthorized access.<br><br>
        Admin login: <code>ridoy</code> / <code>Ridoy@2024</code> — change this after first login.
    </div>
</div>
</body>
</html>
