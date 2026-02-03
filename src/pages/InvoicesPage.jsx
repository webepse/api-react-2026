import invoicesAPI from '../services/invoicesAPI'
import {useState, useEffect} from 'react'
import moment from 'moment'
import Pagination from '../components/Pagination'
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const STATUS_LABELS = {
    PAID: 'Payée',
    SENT: 'Envoyée',
    CANCELED: 'Annulée'
}

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELED: "danger"
}

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const itemsPerPage = 10

    // pour le chargement
    const [loading, setLoading] = useState(true)

    const fetchInvoice = async () => {
        try{
            const data = await invoicesAPI.findAll()
            setInvoices(data)
            setLoading(false)
        }catch(error)
        {
            toast.error("Impossible de charger les factures")
            console.error(error.response)
        }
    }

    const handleDelete = async (id) => {
        const orignalInvoices = [...invoices]
        setInvoices(invoices.filter(invoice => invoice.id !== id))

        try{
            await invoicesAPI.delete(id)
            toast.warning("La facture "+id+" a bien été supprimée")
        }catch(error)
        {
            setInvoices(orignalInvoices)
            toast.error("Impossible de supprimer cette facture")
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    useEffect(() => {
        fetchInvoice()
    },[])

    const formatDate = (str) => moment(str).format('DD/MM/YYYY')

    const handleSearch = (event) => {
        const value = event.currentTarget.value
        setSearch(value)
        // remettre la pagination à 1 après la recherche
        setCurrentPage(1)
    }

    const filteredInvoices = invoices.filter(i =>
        i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        i.amount.toString().includes(search.toLowerCase()) ||
        STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    )

    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage)

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary">Créer une facture</Link>
            </div>
            {/* filtre */}
            <div className="form-group my-3">
                <input type="text" className="form-control" placeholder="Rechercher..." value={search} onChange={handleSearch} />
            </div>
            {(!loading) ? (
                <>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className="text-center">Numéro</th>
                            <th className="text-center">Client</th>
                            <th className="text-center">Date</th>
                            <th className="text-center">Statut</th>
                            <th className="text-center">Montant</th>
                            <th className="text-center"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedInvoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td className="text-center">{invoice.id}</td>
                                <td className="text-center">{invoice.customer.firstName} {invoice.customer.lastName}</td>
                                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                                <td className="text-center">
                            <span className={`badge text-bg-${STATUS_CLASSES[invoice.status]}`}>
                                {STATUS_LABELS[invoice.status]}
                            </span>
                                </td>
                                <td className="text-center">{invoice.amount.toLocaleString()}</td>
                                <td className="text-center">
                                    <Link to={`/invoices/${invoice.id}`} className="btn btn-warning mx-2">Modifier</Link>
                                    <button onClick={() => handleDelete(invoice.id)} className="btn btn-danger mx-2">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage = {currentPage}
                        itemsPerPage = {itemsPerPage}
                        length = {filteredInvoices.length}
                        onPageChanged = {handlePageChange}
                    />
                </>
            ) : (
                <TableLoader />
            )}

        </>
    )
}

export default InvoicesPage