import express from 'express';
import { upload } from '../../../helpers/upload';
import { validateRequest } from '../../middleware/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
   '/create',
   upload.any(),
   validateRequest(ProductValidation.createProductSchema),
   ProductController.createProduct
);
router.get('/list', ProductController.getAllProducts);
router.get('/list-by-admin', ProductController.getAllProductsAdmin);
router.get('/best-sales', ProductController.getBestSalesProducts);
router.get('/details/:id', ProductController.getProduct);
router.get('/by-slug/:slug', ProductController.getProductBySlug);
router.patch('/toggle-publish/:id', ProductController.togglePublishProduct);
router.patch(
   '/update',
   validateRequest(ProductValidation.updateProductSchema),
   ProductController.updateProduct
);

router.patch(
   '/thumbnail/:id',
   upload.single('thumbnail'),
   ProductController.updateThumbnail
);

router.patch(
   '/images/:id',
   upload.fields([{ name: 'images', maxCount: 20 }]),
   ProductController.updateProductImages
);

router.delete('/remove-image/:id', ProductController.removeProductImage);

router.delete('/:id', ProductController.deleteProduct);

router.post(
   '/description-block',
   upload.single('image'),
   ProductController.addDescriptionBlock
);
router.patch(
   '/description-block',
   upload.single('image'),
   ProductController.updateDescriptionBlock
);
router.delete(
   '/description-block/:id',
   ProductController.deleteDescriptionBlock
);

export const ProductRoutes = router;
