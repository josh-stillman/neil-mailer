import express from 'express';
import path from 'path';

import { emailLocals } from '../locals';

const app = express();

app.set('view engine', 'ejs');

app.get('/favicon.ico', (req: any, res: any) => res.status(204));

app.get('/:templateId', (req: any, res: any) => {
  app.set('views', path.join(__dirname, '../..', `/emails/${req.params.templateId}`));
  res.render('html', {
    ...emailLocals,
    unsubscribeLink: `https://www.electricneil.com/unsubscribe/`,
  });
});

app.listen(4000, () => console.log('Email Preview Server running on port 4000!'));
