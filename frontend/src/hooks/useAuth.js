import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useAuth = () => {
    const { user } = useSelector((state) => state.auth);

    const [auth, setAuth] = useState(false)
    const [isGestor, setIsGestor] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            setAuth(true)
            setIsGestor(user.user.role === 'gestor') 
        } else {
            setAuth(false)
            setIsGestor(false)
        }

        setLoading(false)

    }, [user])

    return { auth, isGestor, loading }
}