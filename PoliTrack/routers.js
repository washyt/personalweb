const express = require('express');

const route = express();

route.use(require('./controllers/auth'));
route.use(require('./controllers/index'));
route.use(require('./controllers/notes'));
route.use(require('./controllers/forum'));
route.use(require('./controllers/bills'));
route.use(require('./controllers/comments'));
route.use(require('./controllers/upload'));
route.use(require('./controllers/profile'));
route.use(require('./controllers/chat'));

module.exports = router;
