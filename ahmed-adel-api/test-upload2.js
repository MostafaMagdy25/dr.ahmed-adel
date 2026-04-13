const fs = require('fs');

(async () => {
    try {
        // Create dummy image file
        fs.writeFileSync('test.png', 'fake image bytes');
        
        // 1. Login
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@ahmedadel.com', password: 'changeme123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;

        // 2. Upload
        const formData = new FormData();
        const fileContent = new Blob(['fake image bytes'], { type: 'image/png' });
        formData.append('file', fileContent, 'test.png');

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
