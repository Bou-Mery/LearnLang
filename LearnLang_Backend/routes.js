import express from 'express'
import { 
    addadmin, 
    loginAdmin, 
    logoutAdmin, 
    home, 
    countUser, 
    listAdmin, 
    listUser, 
    deleteUser, 
    listartikel, 
    addArtikel, 
    deleteArticle, 
    addUser, 
    deleteAdmin, 
    addSpelling, 
    addPronunciation, 
    listSpelling, 
    listPronunciation, 
    deleteSpelling, 
    deletePronunciation 
} from './WebCms.js'
import { register, login, user,  insertName,   uploadimage, articleview, articleviewsearch, spellingListBylevel, PronunciationListBylevel, SpellingListById, PronunciationListById, postSpellingById,  postPronunciationById} from './Mobile.js'


const routes = express.Router()

// for Website CMS
routes.get('/home', home)
routes.get('/countUser', countUser)

routes.post('/addadmin', addadmin)
routes.post('/loginAdmin', loginAdmin)
routes.delete('/logoutAdmin', logoutAdmin)
routes.get('/listadmin', listAdmin)
routes.delete('/deleteadmin/:id', deleteAdmin)

routes.get('/listuser', listUser)
routes.delete('/deleteUser/:id', deleteUser)
routes.post('/addUser', addUser)

routes.get('/listSpelling', listSpelling)
routes.get('/listPronunciation', listPronunciation)
routes.post('/addSpelling', addSpelling)
routes.post('/addPronunciation', addPronunciation)
routes.delete('/deleteSpelling/:id', deleteSpelling)
routes.delete('/deletePronunciation/:id', deletePronunciation)

routes.post('/addArtikel', addArtikel)
routes.delete('/deleteArtikel/:id', deleteArticle)


// for Mobile
routes.post('/register', register)
routes.post('/login', login)
routes.get('/user/:id', user)
routes.put('/uploadImage/:id', uploadimage)
routes.put('/insertName/:id', insertName)
routes.get('/articleById/:id', articleview)
routes.get('/articleSearch/:title', articleviewsearch)
routes.get('/listArticle', listartikel)
routes.get('/spellingListByLevel/:level', spellingListBylevel)
routes.get('/pronunciationListByLevel/:level', PronunciationListBylevel)
routes.get('/spellingListById/:id', SpellingListById)
routes.get('/pronunciationListById/:id', PronunciationListById)
routes.post('/checkSpelling/:id', postSpellingById)
routes.post('/checkPronunciation/:id', postPronunciationById)



export default routes