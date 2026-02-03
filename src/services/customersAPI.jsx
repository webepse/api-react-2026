import Axios from 'axios';
import {CUSTOMERS_API} from "../config";

function findAll(){
    return Axios.get(CUSTOMERS_API)
        .then(response => response.data.member)
}

function deleteCustomer(id)
{
    return Axios.delete(`${CUSTOMERS_API}/${id}`)
}

function createCustomer(customer){
    return Axios.post(CUSTOMERS_API, customer)
}

function find(id)
{
    return Axios.get(`${CUSTOMERS_API}/${id}`)
        .then(response => response.data)
}

function updateCustomer(id, customer){
    return Axios.put(`${CUSTOMERS_API}/${id}`, customer)
}

export default {
    findAll: findAll,
    delete: deleteCustomer,
    create: createCustomer,
    find: find,
    update: updateCustomer
}