import Product from "../entity/Product";
import RepositoryInterface from "./repository-interface";

// aqui o nome interface foi apenas para evitar conflitos com o repository de produto ja existente
export default interface ProductRepositoryInterface extends RepositoryInterface<Product> {
  // aqui posso "afunilar", deixar o escopo mais especifico para produto
  // isso é legal por que temos uma interface repository e de la
  // podemos criar novas interfaces repositories mais especificas, por exemplo:
  // findByName(name: string): Promise<Product>;
};
