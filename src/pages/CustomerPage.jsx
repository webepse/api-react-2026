import Field from "../components/forms/Field";
import {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import customersAPI from "../services/customersAPI";
import {toast} from "react-toastify";


const CustomerPage  = () => {
    let {id= "new"} = useParams()
    const navigate = useNavigate()
    const [editing, setEditing] = useState(false);

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const fetchCustomer = async id => {
        try{
            const {firstName, lastName, email, company, user} = await customersAPI.find(id)
            setCustomer({firstName, lastName, email, company, user:"/api/users/"+user.id})
        }catch(error)
        {
            toast.error("Le client n'a pas pu être chargé")
            navigate("/customers",{replace: true})
        }
    }

    useEffect(()=>{
        //console.log(id)
        if(id !== "new")
        {
            setEditing(true)
            fetchCustomer(id)
        }
    },[])

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(customer)
        try{
            // tester si on édite ou non
            if(editing)
            {
                await customersAPI.update(id, customer)
                toast.success("Le client a été modifié")
            }else{
                await customersAPI.create(customer)
                toast.success("Le client a été enregistré")
                navigate("/customers", {replace: true})
            }

        }catch({response}){
            console.log(response)
            const {violations} = response.data
            if(violations){
                const apiErrors = {
                    lastName: "",
                    firstName: "",
                    email: "",
                    company: ""
                }
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                    }
                )
                setErrors(apiErrors)
            }
            toast.error("Une erreur est survenue")
        }

    }

    const handleChange = (event) => {
        //const value = event.currentTarget.value
        //const name = event.currentTarget.name
        const {name, value} = event.currentTarget
        setCustomer(customer => ({...customer, [name]: value}))
    }

    return (
        <>
            {/* (condition) ? si vrai : si faux */}
        {!editing ? <h1>Création d'un client</h1> : <h1>Modification d'un client</h1>}
            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famile"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Adresse E-mail"
                    placeholder="Adresse E-mail du client"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />
                <div className="form-group my-3">
                    <button type="submit" className={"btn " + ((!editing) ? "btn-primary" : "btn-warning")}>{(!editing) ? "Enregistrer" : "Modifier"}</button>
                    <Link to="/customers" className="btn btn-secondary mx-2">Annuler</Link>
                </div>
            </form>
        </>
    )
}

export default CustomerPage;