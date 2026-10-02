import { Router } from "express"
import * as usersServices from "./user.services.js"

const router = Router()

router.get("/",usersServices.getUserById)
router.post("/signup",usersServices.signUp)
router.post("/login",usersServices.login)
router.patch("/update/:id",usersServices.updateUser)
router.delete("/delete",usersServices.deleteUser)








export default router