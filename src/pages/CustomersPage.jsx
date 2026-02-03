import {useState, useEffect} from 'react';
import Axios from "axios";
import Pagination from "../components/Pagination"
import customersAPI from "../services/customersAPI";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("")

    // pour le chargement
    const [loading, setLoading] = useState(true);

    // pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const itemsPerPage = 10

    const fetchCustomers = async () => {
        try{
            const data = await customersAPI.findAll()
            setCustomers(data)
            setLoading(false) // fini le chargement
        }catch(error){
            toast.error("Impossible de charges les clients")
            console.error(error.response)
        }
    }

    useEffect(() => {
        fetchCustomers()
    },[])

    const handleSearch = event =>{
        const value = event.currentTarget.value
        setSearch(value)
        setCurrentPage(1)
    }

    const filteredCustomers = customers.filter(c =>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase()))

    )

    const handleDelete = async (id) => {
        // pessimiste
        const orignalCustomers = [...customers]
        // optimiste
        setCustomers(customers.filter(customer => customer.id !== id))

        try{
            await customersAPI.delete(id)
            toast.warning("Le client "+id+" a bien été supprimé")
        }catch(error){
            setCustomers(orignalCustomers)
            toast.error("La suppression du client n'a pas fonctionné")
        }
    }

    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage)


    return(
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>
            {/* filtre */}
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Rechercher..." value={search} onChange={handleSearch} />
            </div>
            { (!loading) ? (
                <>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Client</th>
                            <th>E-mail</th>
                            <th>Entreprise</th>
                            <th className="text-center">Factures</th>
                            <th className="text-center">Montant total</th>
                            <th className="text-center">Montant restant</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.firstName} {customer.lastName}</td>
                                <td>{customer.email}</td>
                                <td>{customer.company}</td>
                                <td className="text-center">
                                    <span className="badge text-bg-primary">{customer.invoices.length}</span>
                                </td>
                                <td className="text-center">{customer.totalAmount.toLocaleString()}</td>
                                <td className="text-center">{customer.unpaidAmount.toLocaleString()}</td>
                                <td>
                                    <Link to={`/customers/${customer.id}`} className="btn btn-sm btn-warning mx-1">Editer</Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(customer.id)}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        length={filteredCustomers.length}
                        onPageChanged={handlePageChange}
                    />
                </>

            ): (
                <TableLoader />
            )}

        </>
    )
}

export default CustomersPage;