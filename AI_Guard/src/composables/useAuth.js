import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

export function useAuth() {
    const router = useRouter()

    const login = async (username, password) => {
        try {
            const response = await fetch('http://192.168.50.26:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()

            if (response.ok) {
                isLoggedIn.value = true
                user.value = data.user
                localStorage.setItem('isLoggedIn', 'true')
                localStorage.setItem('user', JSON.stringify(data.user))
                return { success: true }
            } else {
                return { success: false, error: data.error }
            }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, error: 'Network error' }
        }
    }

    const logout = () => {
        isLoggedIn.value = false
        user.value = null
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('user')
        router.push('/login')
    }

    return {
        isLoggedIn,
        user,
        login,
        logout
    }
}
