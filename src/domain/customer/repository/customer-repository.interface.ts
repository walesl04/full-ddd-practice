import Customer from "../entity/Customer";
import RepositoryInterface from "../../@shared/repository/repository-interface";

export default interface CustomerRepositoryInterface extends RepositoryInterface<Customer> {
};
