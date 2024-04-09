import express from 'express'
import headshotsRouter from './headshots/router';
const app = express();


app.use('/', headshotsRouter);


app.listen(3000, () => {
    console.log(`App started`)
})