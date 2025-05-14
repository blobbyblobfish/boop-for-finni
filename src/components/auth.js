import { Button, TextField, Alert } from '@mui/material'
import { auth } from '../firebase-config'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { useState } from "react"

export const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch (error) {
            <Alert severity="error">
                There was an error. Please try again. 
                {error}
            </Alert>
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            
        }
    }

    return <div>
        <TextField 
          required
          id="outlined-required"
          label="Username"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField 
          required
          id="outlined-password-input"
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          onClick={signIn}
          variant="contained"
        >
            Login
        </Button>
    </div>
}