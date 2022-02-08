import React, {forwardRef,useState,useEffect} from 'react';
import axios from 'axios';
import './App.css';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import {Modal,TextareaAutosize,TextField,Button,InputLabel,Input} from '@material-ui/core';
import Swal from 'sweetalert2';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {MDBNavbarLink} from 'mdb-react-ui-kit';


//Url para obtener los valores de las solicitudes insertadas
const baseUrl="http://10.1.0.25:8080/requerimientos/getRequerimientos";
//Url para agregar una nueva solicitude
const baseUrl2="http://10.1.0.25:8080/requerimientos/agregarSolicitud";
//Url para actualizar los registros de las solicitudes hechas
const baseUrl3="http://10.1.0.25:8080/requerimientos/actualizarSolicitud";
//const baseUrl4="http://10.1.0.25:8080/requerimientos/actualizarSolicitudPut";

//Url para la el getGeneral
//const baseUrlG="http://10.1.0.25:8080/requerimientos/getGeneral";

//diseño para las ventanas modal
const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '5px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  modal1: {
    position: 'absolute',
    width: 800,
    height:800,
    backgroundColor: theme.palette.background.paper,
    border: '5px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  },
  inputMaterial:{
    width: '100%',
    backgroundColor:'white'
  }
}));

//campos para la tabla a mostrar para el axios.get
const columns=[
{title:'Folio',field:'folio'},
{title:'Nombre',field:'nombre'},
{title:'Tipo',field:'tipo'},
{title:'Estado',field:'estado'},
{title:'Prioridad',field:'prioridad'},
{title:'Responsable',field:'responsable'},
{title:'Responsable_Téc.',field:'responsableTecnico'},
{title:'Solicitante',field:'solicitante'},
{title:'Área',field:'area'},
{title:'Uni_Negocio',field:'unidadNegocio'},
{title:'F._Apertura',field:'fechaRegistro'} ,
{title:'F._Cierre',field:'fechaCierre'},
{title:'F._GoProd.',field:'fechaGoProd'},
{title:'F._Dev',field:'fecha_dev'},
{title:'F._QA',field:'fecha_qa'}
]; 
 
//Conjunto de Iconos de material-ui 
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  DeleteOutline: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function Consulta1(){
  const styles= useStyles();
  const [data,setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);

  //Body para la consulta axios.put
  const [SolicitudSeleccionada, setSolicitudSeleccionada]=useState({   
      id:'',
      nombre:'',
      objetivo:'',
      tipo:'',
      responsable:'',
      responsableTecnico:'',
      solicitante:'',
      estado:'ABIERTO',
      prioridad:'',
      fechaCierre:'' ,
      fechaGoProd:''
  })

    //Body para crear registro
    const [SolicitudSeleccionada1, setSolicitudSeleccionada1]=useState({   
      id_solicitud:'',
      nombre_solicitud:'',
      objetivo:'',
      url:'',
      id_tipo_solicitud:'',
      id_responsable:'',
      id_responsable_tecnico:'',
      id_solicitante:'',
      id_estado:1,
      id_prioridad:'',
      fecha_cierre:''  
  })


 //manejador para la consulta de los datos enviados y consultado por su propiedad (name)
   const handleChange=async e=>{
    const {name, value}=e.target;
    setSolicitudSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    })      
    )
  }  

  //manejador para la inserción  de los datos 
  const handleChange1=async e=>{
    const {name, value}=e.target;
    setSolicitudSeleccionada1(prevState=>({
      ...prevState,
      [name]: value
    })      
    )
  }

    /*  const config = {
    headers: {
      "Content-Type": "application/json",
      
      'Access-Control-Request-Methods':'POST,PUT,DELETE',
      'Connection':'keep-alive',
    
      'Accept-Encoding':'gzip, deflate, br',
      'Host':'<calculated when request is sent>',
      'Content-Length':'<calculated when request is sent>'

      }
    }  */

// Petición para la consulta de las solicitudes registradas
  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }
   
// Petición para registrar las solicitudes con axios.post
   const peticionPost=async()=>{
    await axios.post(baseUrl2, SolicitudSeleccionada1)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar()
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Registro almacenado',
        showConfirmButton: false,
        timer: 1500
      })
    }).catch(error=>{
      window.location.href='/solicitudes'; 
      abrirCerrarModalInsertar()
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Registro almacenado',
        showConfirmButton: false,
        timer: 10500
      });
      console.log(error);
     
    })
  
  } 
//Petición para actualizar las solicitudes con axios.put
 const peticionPut=async()=>{
  await axios.put(baseUrl3, SolicitudSeleccionada)
  .then(response=>{
    setData(data.concat(response.data));
    abrirCerrarModalEditar()
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Registro almacenado',
      showConfirmButton: false,
      timer: 1500
    })
  }).catch(error=>{      
        
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Registro almacenado',
        showConfirmButton: false,
        timer: 10500
      
      });
      abrirCerrarModalEditar()   
      window.location.href='/solicitudes';   

    });

   
}   
  // Borrar registros con axios.delete
  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+SolicitudSeleccionada.id)
    .then(response=>{
      setData(data.filter(solicitud=>solicitud.nombre_solicitud!==SolicitudSeleccionada.nombre_solicitud));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }  

  //------ abrir y cerrar las ventanas modal ya sea para ingresar registros, editar y eliminar
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }
  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }
//-----

//---Método para la selección de la edicón de registros
  const seleccionarSolicitud=(solicitud, caso)=>{
    setSolicitudSeleccionada(solicitud);  
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }
 
  //Hook para inicializar la peticionGet y capturarInfoSoli 
  useEffect(()=>{
     peticionGet();  
     capturarInfoSoli();
  
  },[])
 
/*Variables de estados para la captura
 de los valores de cada lista*/
const [PrioridadSeleccionada, setPrioridadSeleccionada]=useState([])
const [ResponsableSeleccionada, setResponsableSeleccionada]=useState([])
const [ResponsableTecnicoSeleccionada, setResponsableTecnicoSeleccionada]=useState([])
const [TipoRequiSeleccionada, setTipoRequiSeleccionada]=useState([])
const [SolicitanteSeleccionada, setSolicitanteSeleccionada]=useState([])
const [EstadoSeleccionada, setEstadoSeleccionada]=useState([])

      
  //Petición para obtener lista general de los items de las solicitudes
const capturarInfoSoli=()=> { 
  axios
  .get('http://10.1.0.25:8080/requerimientos/getGeneral')
  .then((response)=>{
    console.log(response);
    setPrioridadSeleccionada(response.data.listaPrioridad)
    setResponsableSeleccionada(response.data.listaResponsables)
    setResponsableTecnicoSeleccionada(response.data.listaRespoTecnicos)
    setTipoRequiSeleccionada(response.data.listaTipoRequerimiento)
    setSolicitanteSeleccionada(response.data.listaSolicitante)
    setEstadoSeleccionada(response.data.listaEstado) 
    const a=(response.data.listaTipoRequerimiento)   
    console.log('-->',a)
  })
  .catch(error=>{
    console.log(error);
  });
  
} 
 
 //Ventana para Ingresar solicitud
  const bodyInsertar=(
    <div className={styles.modal}>
      <h2>Agregar Solicitud</h2>
     
      <Input className={styles.inputMaterial}  name="nombre_solicitud" id="nombre_solicitud" onChange={handleChange1} placeholder="Nombre" />
      <br />      <br />

      <TextareaAutosize className={styles.inputMaterial} placeholder="Objetivo"  rominRows={10}  label="Objetivo de la solicitud" name="objetivo" id="objetivo" onChange={handleChange1}/>          
    <br />      <br />

    <TextareaAutosize className={styles.inputMaterial} placeholder="URL Drive"  rominRows={10} name="url" id="url" onChange={handleChange1}/>          

    <br />      <br />

     
      <select name="id_tipo_solicitud" id="id_tipo_solicitud" className={styles.inputMaterial} onChange={handleChange1}  required>
        <option value="">Seleccione tipo de solicitud</option>
         {TipoRequiSeleccionada && TipoRequiSeleccionada.map(elemento=>(
           <option key={elemento.id_tipo_solicitud} value={elemento.id_tipo_solicitud} >{elemento.abreviatura}</option>
         )

         )}
        </select>


      <br />      <br />

    
      <select name="id_responsable" id="id_responsable" className={styles.inputMaterial} onChange={handleChange1} required>
      <option value="">Seleccione Responsable</option>
         {ResponsableSeleccionada && ResponsableSeleccionada.map(elemento=>(
           <option key={elemento.id_responsable} value={elemento.id_responsable}>{elemento.nombre_responsable}</option>
         )

         )}
        </select>

      <br /><br />
      
      <select name="id_responsable_tecnico" id="id_responsable_tecnico" className={styles.inputMaterial} onChange={handleChange1} required>
      <option value="">Seleccione Responsable Técnico</option>
         {ResponsableTecnicoSeleccionada && ResponsableTecnicoSeleccionada.map(elemento=>(
           <option key={elemento.id_responsable} value={elemento.id_responsable}>{elemento.nombre_responsable}</option>
         )

         )}
        </select>

      <br /><br />
     
      <select name="id_solicitante" id="id_solicitante" className={styles.inputMaterial}onChange={handleChange1} required>
      <option value="">Seleccione Solicitante</option>
         {SolicitanteSeleccionada && SolicitanteSeleccionada.map(elemento=>(
           <option key={elemento.id_solicitante} value={elemento.id_solicitante}>{elemento.nombre_solicitante}</option>
         )

         )}
        </select>

      <br /><br />
     
      <select name="id_prioridad" id="id_prioridad" className={styles.inputMaterial} onChange={handleChange1} required>
      <option value="">Seleccione Prioridad</option>
         {PrioridadSeleccionada && PrioridadSeleccionada.map(elemento=>(
           <option key={elemento.id_prioridad} value={elemento.id_prioridad}>{elemento.nombre_prioridad}</option>
         )

         )}
        </select>
      
      <br /><br />
      <div align="right">
        <Button 
          color="primary"
          variant="contained"
          style={{textTransform: 'none'}}
          size="large" 
          onClick={()=>peticionPost()}>Insertar</Button>
        <Button 
          color='secondary'
          variant="contained" 
          style={{textTransform: 'none'}}
          size="large"  
          onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )
   //Ventana de Editar la solicitud
  const bodyEditar=(
    <div className={styles.modal1}>
      <h2>Actualizar Solicitud</h2>
      <br/>
      <input readOnly label="Outlined secondary" color="secondary"   label="ID" name="id" id="id" onChange={handleChange} Value={SolicitudSeleccionada && SolicitudSeleccionada.id}  />
      <br />     
      <InputLabel>Nombre de la solicitud</InputLabel>      
      <input  color="secondary"  className={styles.inputMaterial} label="Nombre de la solicitud" name="nombre" id="nombre" onChange={handleChange}  Value={SolicitudSeleccionada && SolicitudSeleccionada.nombre} />
      <br />
      <InputLabel>Objetivo</InputLabel>  
      <textarea className={styles.inputMaterial} id="objetivo" name='objetivo' label="Objetivo" multiline rows={4} fullWidth  onChange={handleChange}  defaultValue={SolicitudSeleccionada && SolicitudSeleccionada.objetivo} color="secondary" />       
      <br />
      <InputLabel>URL Drive</InputLabel> 
      <input  color="secondary"  className={styles.inputMaterial} label="URL Drive" name="url" id="url" onChange={handleChange}  Value={SolicitudSeleccionada && SolicitudSeleccionada.url} />
      
      <br/>
     <InputLabel >Tipo Solicitud</InputLabel>
     <select name="tipo" id='tipo' className={styles.inputMaterial} onChange={handleChange} >
              
           {TipoRequiSeleccionada && TipoRequiSeleccionada.map(elemento=>(
              (SolicitudSeleccionada.tipo === elemento.abreviatura)
              ?
              <option   Value={elemento.abreviatura} selected> {elemento.abreviatura} </option> 
              :
              <option  key={elemento.id_tipo_solicitud} Value={elemento.abreviatura}>{elemento.abreviatura}</option>
                )
            )}            
          
     </select>
      <br />   

      <InputLabel >Responsable</InputLabel>
      <select name="responsable" id="responsable" className={styles.inputMaterial} onChange={handleChange} >
            {ResponsableSeleccionada && ResponsableSeleccionada.map(elemento=>(
              (SolicitudSeleccionada.responsable === elemento.nombre_responsable)
              ?
              <option   Value={elemento.nombre_responsable} selected> {elemento.nombre_responsable} </option> 
              :
              <option key={elemento.id_responsable} Value={elemento.nombre_responsable}>{elemento.nombre_responsable}</option>
                )
            )}      
      </select>
      <br />

      <InputLabel >Responsable Técnico</InputLabel>
      <select name="responsableTecnico" id="responsableTecnico" className={styles.inputMaterial} onChange={handleChange} >
          {ResponsableTecnicoSeleccionada && ResponsableTecnicoSeleccionada.map(elemento=>(
            (SolicitudSeleccionada.responsableTecnico === elemento.nombre_responsable)
            ?
            <option   Value={elemento.nombre_responsable} selected> {elemento.nombre_responsable} </option> 
            :
            <option  key={elemento.id_responsable} Value={elemento.nombre_responsable}>{elemento.nombre_responsable}</option>
              )
          )}
      
      </select>
      <br />
      <InputLabel >Solicitante</InputLabel>
      <select name="solicitante" id="solicitante" className={styles.inputMaterial} onChange={handleChange} >
          {SolicitanteSeleccionada && SolicitanteSeleccionada.map(elemento=>(
              (SolicitudSeleccionada.solicitante === elemento.nombre_solicitante)
              ?
              <option   Value={elemento.nombre_solicitante} selected> {elemento.nombre_solicitante} </option> 
              :
              <option  key={elemento.id_solicitante} Value={elemento.nombre_solicitante}>{elemento.nombre_solicitante}</option>
                )
          )}     
     
      </select>
      <br />
      <InputLabel >Estatus de la Solicitud</InputLabel>
      <select name="estado" id="estado" className={styles.inputMaterial} onChange={handleChange} >
          {EstadoSeleccionada && EstadoSeleccionada.map(elemento=>(
              (SolicitudSeleccionada.estado === elemento.nombre_estado)
              ?
              <option   Value={elemento.nombre_estado} selected> {elemento.nombre_estado} </option> 
              :
              <option key={elemento.id_estado} Value={elemento.nombre_estado}>{elemento.nombre_estado}</option>
                )
          )}
     
      </select>
      <br />
      <InputLabel>Prioridad del Proyecto</InputLabel>
        <select name="prioridad" id="prioridad" className={styles.inputMaterial} onChange={handleChange}  >
          {PrioridadSeleccionada && PrioridadSeleccionada.map(elemento=>(
            (SolicitudSeleccionada.prioridad === elemento.nombre_prioridad)
            ?
            <option   Value={elemento.nombre_prioridad} selected> {elemento.nombre_prioridad} </option> 
            :
            <option key={elemento.id_prioridad} Value={elemento.nombre_prioridad}>{elemento.nombre_prioridad}</option>
              )
          )}
       
        </select>
      
      <br />
      <InputLabel>Fecha de Cierre</InputLabel>
      <input type='date'  Value={SolicitudSeleccionada.fechaCierre} label="Outlined secondary" color="secondary" focused   name="fechaCierre" id="fechaCierre" onChange={handleChange}/>
     <br/>
     <InputLabel>Fecha de Producción</InputLabel>
      <input type='date'  Value={SolicitudSeleccionada.fechaGoProd} label="Outlined secondary" color="secondary" focused   name="fechaGoProd" id="fechaGoProd" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button  color="primary" variant="contained" style={{textTransform: 'none'}} size="large" onClick={()=>peticionPut()}>Editar</Button>
        <Button color='secondary' variant="contained" 
          style={{textTransform: 'none'}}
          size="large"   onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
      
    </div>
  )
  //---->En construcción ya que esta función no se admite por el momento en la plataforma
  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar al artista <b>{SolicitudSeleccionada && SolicitudSeleccionada.nombre_solicitud}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()}>Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )
return(
  <div className="App">  
<br />   
      <MDBNavbarLink aria-current='page' href='/menuZ'>
                <FontAwesomeIcon icon={faHome} size="6x" href='/menuZ'/>Inicio                
      </MDBNavbarLink>     
      
                 
      <MaterialTable
          columns={columns}
          data={data}
          title="Solicitudes"
          icons={tableIcons}
          align="center"         
          
          actions={[
            
          ]}
                   
          options={{
            actionsColumnIndex:-1,
            rowStyle: {
              backgroundColor: '#EEE',
            },
            exportButton: true,
            filtering: true,
            headerStyle: {
              backgroundColor: '#01579b',
              color: '#FFF'
            }
          }}

          localization={{
          header:{
          actions:'Acción'
          }
          }}

          

/>
           
        <Modal
            open={modalInsertar}
            onClose={abrirCerrarModalInsertar}>
              {bodyInsertar}
          
        </Modal>

        <Modal
            open={modalEditar}
            onClose={abrirCerrarModalEditar}>
              {bodyEditar}
        </Modal>

        <Modal
            open={modalEliminar}
            onClose={abrirCerrarModalEliminar}>
              {bodyEliminar}
        </Modal>
</div>


);

}
export default Consulta1;
