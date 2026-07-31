import * as ftp from 'basic-ftp';

async function run() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        console.log("Connecting to FTP...");
        await client.access({
            host: process.env.FTP_SERVER,
            user: process.env.FTP_USERNAME,
            password: process.env.FTP_PASSWORD,
            secure: false // Hostinger often prefers explicit TLS or plain FTP, basic-ftp will try plain if secure is false
        });
        
        console.log("--- CURRENT DIRECTORY ---");
        console.log(await client.pwd());
        
        console.log("--- ROOT CONTENTS ---");
        const listRoot = await client.list();
        for (const item of listRoot) {
            console.log(item.type === 2 ? '[DIR] ' : '[FILE] ', item.name);
        }

        console.log("--- CHECKING FOR PUBLIC_HTML ---");
        if (listRoot.some(item => item.name === 'public_html')) {
            const listPublic = await client.list('public_html');
            console.log("--- PUBLIC_HTML CONTENTS ---");
            for (const item of listPublic) {
                console.log(item.type === 2 ? '[DIR] ' : '[FILE] ', item.name);
            }
        }
        
        console.log("--- CHECKING FOR DOMAINS ---");
        if (listRoot.some(item => item.name === 'domains')) {
            const listDomains = await client.list('domains');
            console.log("--- DOMAINS CONTENTS ---");
            for (const item of listDomains) {
                console.log(item.type === 2 ? '[DIR] ' : '[FILE] ', item.name);
            }
        }

    }
    catch(err) {
        console.error("FTP Error:", err);
    }
    client.close();
}

run();
