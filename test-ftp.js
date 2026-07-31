import * as ftp from 'basic-ftp';

async function run() {
    const client = new ftp.Client();
    try {
        console.log("Connecting to FTP...");
        await client.access({
            host: process.env.FTP_SERVER,
            user: process.env.FTP_USERNAME,
            password: process.env.FTP_PASSWORD,
            secure: false
        });
        
        console.log("--- CURRENT PWD ---");
        console.log(await client.pwd());
        
        console.log("--- LISTING / ---");
        const listRoot = await client.list("/");
        for (const item of listRoot) {
            console.log(item.type === 2 ? '[DIR] ' : '[FILE] ', item.name);
        }

        if (listRoot.some(i => i.name === 'domains')) {
            console.log("--- LISTING /domains ---");
            const listDomains = await client.list("/domains");
            for (const item of listDomains) {
                console.log(item.type === 2 ? '[DIR] ' : '[FILE] ', item.name);
            }
            if (listDomains.some(i => i.name === 'firstpathdaycare.ca')) {
                console.log("--- LISTING /domains/firstpathdaycare.ca ---");
                const listFpdc = await client.list("/domains/firstpathdaycare.ca");
                for (const item of listFpdc) {
                    console.log(item.type === 2 ? '[DIR] ' : '[FILE] ', item.name);
                }
            }
        }
    }
    catch(err) {
        console.error("FTP Error:", err);
    }
    client.close();
}
run();
