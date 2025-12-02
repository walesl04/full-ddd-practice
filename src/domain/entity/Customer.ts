/**
 * Aqui é sobre expressividade
 * A modelagem do dominio expressa a ideia do negócio e não apenas setters e getters
 */


// #Aula sobre Consistência constante em primeiro lugar:
// objeto com valores em branco ou vazio, é errado, pois se caracteriza inconsistência de estado
// por isso não deve ser possível instanciar um objeto com valores de instância inconsistentes


// #Aula Princípio de autovalidação:
// Uma entidade por padrão ela sempre deve se autovalidar
// exemplo do metodo validate


// #Aula Entidade vs ORM:
// Essa entidade é uma entidade de negócio e não de persistência por isso é diferente da ORM
// São contextos diferentes
/*

# Entity - Complexidade de negócio
  - Entity
  -- customer.ts (regras de negocio)

# Infra - Mundo externo - Complexidade acidental
  - Entity / Model
  -- customer.ts (get, set)

*/
import type Address from "./Address.js";

class Customer {
  private _id: string;
  private _name: string;
  private _address!: Address;
  private _active: boolean = true;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
  }

  validate() {
    if (this._name.length == 0) {
      throw new Error("Name is required!");
    }
    if (this._id.length == 0) {
      throw new Error("ID is required!");
    }
  }

  get id() {
    return this._id;
  }

  get isActive() {
    return this._active;
  }

  get name() {
    return this._name;
  }

  get rewardPoints() {
    return this._rewardPoints;
  }

  set Address(address: Address) {
    this._address = address;
  }

  get Address() {
    return this._address;
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  activate() {
    if (!this._address) {
      throw new Error("Address is required to activate!");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }
}

export default Customer;