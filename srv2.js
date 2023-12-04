import express from 'express';
import cors from 'cors';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const app = express();
const port = 5001;
const fetchModule = await import('node-fetch');
const fetch = fetchModule.default;

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.get('/', (req, res) => {
    res.send('Running');
});

app.get('/puntos/:id', async (req, res) => {
    const id = req.params.id;
  
    const url = `https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp?ps_tipo_identificacion=CED&ps_identificacion=${id}`;
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const dom = new JSDOM(html);
            const document = dom.window.document;

            const tabla = document.querySelectorAll('table')[1];
            const puntuacion = tabla.querySelectorAll('td')[2].textContent;

            const result = {
                puntuacion: puntuacion
            };
            res.json(result);
        })
        .catch(error => {
            console.error(error);
            res.json("Error, Verifique la cedula");
        });

});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
