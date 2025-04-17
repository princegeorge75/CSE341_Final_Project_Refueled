const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  //swagger.tags = ['Hello world'];
    res.render('./products')
  })

  router.get('/', (req, res) => {
    //swagger.tags = ['Hello world'];
      res.render('./customers')
    })
  
router.use('/products', require('./products'));
router.use('/customers', require('./customers'));

module.exports = router;