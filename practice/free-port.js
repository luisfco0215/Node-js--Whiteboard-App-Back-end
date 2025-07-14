import net from 'node:net';
import pc from 'picocolors'

const findAvailablePort = (desirePort) => {
    return new Promise((resolved, rejected) => {
        const server = net.createServer();
        
        server.listen(desirePort, () => {
            const { port } = server.address();
            server.close(() => {
                resolved(port);
            })
        });

        server.on('error', (err) => {
            if(err.code === 'EADDRINUSE')
                findAvailablePort(0).then(port => resolved(port));
            else
                rejected(err.message);
            
        });
    });
}

findAvailablePort(3000).then(port => {
    console.log(`Server listening on port http://localhost:${pc.yellow(port)}`);
}).catch(err => console.log(err));