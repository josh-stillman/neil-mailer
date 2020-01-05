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
    name: 'test name',
    unsubscribeLink: `https://www.electricneil.com/unsubscribe/`,
  });
});

app.listen(4000, () => console.log('Email Preview Server running on port 4000!'));

/*
  Steps to send:
  1. Update Image, Copy, Calendar, and Map links
  2. Update Subject
  3. Preview
  4. Send
*/
