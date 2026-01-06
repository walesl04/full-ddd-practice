import Product from "../entity/Product";
import RepositoryInterface from "../../@shared/repository/repository-interface";

export default interface ProductRepositoryInterface extends RepositoryInterface<Product> {
};
