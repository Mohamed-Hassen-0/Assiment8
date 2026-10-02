import { Router } from "express"
import * as notesServices from "./notes.services.js"

const router = Router()

router.post("/",notesServices.createNote)
router.put("/replace/:noteId",notesServices.replaceNote)
router.get("/paginate-sort",notesServices.getPaginatedNotes)
router.patch("/all",notesServices.updateAllTitles)
router.get("/getnotebycontent",notesServices.getNoteByContent)
router.get("/getnoteswithuser",notesServices.getNotesWithUser)
router.get("/getnoteaggregate",notesServices.getNotesAggregate)
router.delete("/deleteall",notesServices.deleteAllNotes)
router.patch("/:noteId",notesServices.updateNote)
router.delete("/:noteId",notesServices.deleteNote)
router.get("/:noteId",notesServices.getNoteById)


export default router