const fs = require('fs');

(async () => {
    try {
        fs.writeFileSync('test.txt', 'hello test file');
        
        // 1. Login
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@ahmedadel.com', password: 'changeme123' })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error('Login failed: ' + loginData.message);
        
        const token = loginData.token;

        // 2. Upload
        const formData = new FormData();
        const fileContent = new Blob(['hello test file'], { type: 'text/plain' });
        formData.append('file', fileContent, 'test.txt');

        const res = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();
        console.log('Upload Status:', res.status);
        console.log('Upload Response:', data);
    } catch (e) {
        console.error('Error:', e);
    }
})();
