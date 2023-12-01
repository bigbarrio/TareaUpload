// Lista inicial de sujetos
const initialSubjectsList = [
    {
        id: '1',
        nombre: 'David Choak',
        tipo: 'Cargado',
        dondeVive: 'piso 70 de Lakeview',
        desdeCuandoDescargado: '23-1-10',
        posibleCulpabilidad: 'delincuente',
        urlImagen: 'imgs/luke.webp',
        comentarios: 'Es el sospechoso numero uno.'
    }
];

// Variables globales
let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
let isListVisible = true;
let lastVisibleState = 'list'; // Nueva variable para recordar el último estado

// Cargar la lista inicial en localStorage si está vacío
function initializeSubjects() {
    if (!localStorage.getItem('subjects')) {
        localStorage.setItem('subjects', JSON.stringify(initialSubjectsList));
    }
    subjects = JSON.parse(localStorage.getItem('subjects'));
}

// Función para cambiar entre la lista de sujetos y una imagen de fondo
function toggleDisplay() {
    const details = document.getElementById('subjectDetails');
    const list = document.getElementById('subjectListContainer');
    const toggleButton = document.getElementById('toggleDisplayButton');
    const addNewSubjectButton = document.getElementById('addNewSubjectButton');
    const backgroundImage = document.getElementById('backgroundImage');

    if (isListVisible || details.style.display === 'block') {
        // Guardar el último estado visible antes de ocultar
        lastVisibleState = details.style.display === 'block' ? 'details' : 'list';

        details.style.display = 'none';
        list.style.display = 'none';
        addNewSubjectButton.style.display = 'none';
        backgroundImage.style.display = 'block';
        toggleButton.textContent = 'Mostrar Información';
        isListVisible = false;
    } else {
        // Mostrar según el último estado guardado
        backgroundImage.style.display = 'none';
        addNewSubjectButton.style.display = 'block';
        
        if (lastVisibleState === 'details') {
            details.style.display = 'block';
        } else {
            list.style.display = 'block';
        }
        
        toggleButton.textContent = 'Ocultar Información';
        isListVisible = true;
    }
}


// Función para cargar la lista de sujetos
function loadSubjectsList() {
    const container = document.getElementById('subjectListContainer');
    container.innerHTML = '';
    subjects.forEach((subject, index) => {
        const div = document.createElement('div');
        const borderClass = subject.tipo === 'cargado' ? 'descargado' : 'vivo'; // Clase para el borde
        const nameColorClass = `culpabilidad-${subject.culpabilidad}`; // Clase para el color del nombre

        div.className = `subject-list-item ${borderClass} ${nameColorClass}`;
        div.innerHTML = `
            <img src="${subject.urlImagen || 'imgs/sinImagen.png'}" alt="${subject.nombre}">
            <span>${subject.nombre}</span>
        `;
        div.addEventListener('click', () => editSubject(subject, index));
        container.appendChild(div);
    });
}

// Función auxiliar para obtener el color del texto según la culpabilidad
function getColorForCulpability(culpabilidad) {
    switch (culpabilidad) {
        case 'posible':
            return 'green';
        case 'cooperador':
            return 'orange';
        case 'perpetrador':
            return 'red';
        default:
            return 'black'; // Color por defecto
    }
}

//maneja la vista previa de la imagen:
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('subjectImage');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

// Función para controlar la visibilidad del campo 'Descargado Desde'
function handleTipoChange() {
    const tipo = document.getElementById('tipo').value;
    const descargadoContainer = document.getElementById('descargadoContainer');
    if (tipo === 'cargado') {
        descargadoContainer.style.display = 'block';
    } else {
        descargadoContainer.style.display = 'none';
    }
}
// Función para editar un sujeto
let currentEditingIndex = null; // Índice del sujeto que se está editando
function editSubject(subject,index) {
    currentEditingIndex = index; // Guarda el índice del sujeto que se está editando
    document.getElementById('nombre').value = subject.nombre;
    document.getElementById('tipo').value = subject.tipo;
    document.getElementById('vive').value = subject.dondeVive;
    document.getElementById('descargadoDesde').value = subject.descargadoDesde || '';
    document.getElementById('culpabilidad').value = subject.culpabilidad;
    document.getElementById('subjectImage').src = subject.urlImagen || 'imgs/luke.webp';
    document.getElementById('comentarios').value = subject.comentarios || '';
    document.getElementById('subjectDetails').style.display = 'block';
    document.getElementById('subjectListContainer').style.display = 'none';
    document.getElementById('deleteSubjectButton').style.display = 'block'; // Muestra el botón de eliminar
    document.getElementById('cancelButton').style.display = 'block';
    lastVisibleState = 'details'; // Actualiza el estado al editar un sujeto
}
function deleteCurrentSubject() {
    if (currentEditingIndex !== null) {
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este sujeto?");
        if (confirmDelete) {
            subjects.splice(currentEditingIndex, 1); // Elimina el sujeto
            localStorage.setItem('subjects', JSON.stringify(subjects)); // Actualiza el localStorage
            loadSubjectsList(); // Recarga la lista
            // Oculta el formulario y muestra la lista
            document.getElementById('subjectDetails').style.display = 'none';
            document.getElementById('subjectListContainer').style.display = 'block';
            isListVisible = true;
        }
    }
}

// Función para guardar un sujeto
// Función para guardar o actualizar un sujeto
// Función para guardar o actualizar un sujeto
function saveSubject() {
    // Obtiene los valores de los campos del formulario.
    const nombre = document.getElementById('nombre').value;
    const tipo = document.getElementById('tipo').value;
    const vive = document.getElementById('vive').value;
    const descargadoDesde = document.getElementById('descargadoDesde').value;
    const culpabilidad = document.getElementById('culpabilidad').value;
    const comentarios = document.getElementById('comentarios').value;

    // Obtiene la imagen en formato base64 del elemento img.
    let urlImagen = document.getElementById('subjectImage').src;
    if (document.getElementById('imageInput').files.length > 0) {
        // Si se ha subido una nueva imagen, usa su URL temporal (se asume que tienes una función para manejar esto).
        urlImagen = document.getElementById('subjectImage').src;
    } else if (currentEditingIndex !== null && subjects[currentEditingIndex].urlImagen) {
        // Si no se ha subido una imagen y el sujeto actual tiene una imagen existente, consérvala.
        urlImagen = subjects[currentEditingIndex].urlImagen;
    } else {
        // De lo contrario, usa la imagen predeterminada.
        urlImagen = 'imgs/sinImagen.png';
    }

    // Verifica si todos los campos obligatorios están completos.
    if (!nombre || !tipo || !vive || !culpabilidad) {
        alert('Por favor, completa los campos obligatorios.');
        return;
    }

    // Busca si ya existe un sujeto con el mismo nombre.
    const existingSubjectIndex = subjects.findIndex(s => s.nombre === nombre);

    // Si el sujeto ya existe, actualiza sus datos.
    if (existingSubjectIndex !== -1) {
        subjects[existingSubjectIndex] = { nombre, tipo, vive, descargadoDesde, culpabilidad, urlImagen, comentarios };
    } else {
        // Si el sujeto no existe, lo agrega al array de sujetos.
        subjects.push({ nombre, tipo, vive, descargadoDesde, culpabilidad, urlImagen, comentarios });
    }

    // Actualiza los sujetos en localStorage.
    localStorage.setItem('subjects', JSON.stringify(subjects));

    // Recarga la lista de sujetos para mostrar los cambios.
    loadSubjectsList();

    // Oculta el formulario y muestra la lista.
    document.getElementById('subjectDetails').style.display = 'none';
    document.getElementById('subjectListContainer').style.display = 'block';
    isListVisible = true;
    lastVisibleState = 'list';
}
//funcion cancelar editado
function cancelEdit() {
    document.getElementById('subjectDetails').style.display = 'none';
    document.getElementById('subjectListContainer').style.display = 'block';
    isListVisible = true;
    lastVisibleState = 'list';
}



// Función para abrir el formulario con campos vacíos para un nuevo sujeto
function openNewSubjectForm() {
    
    document.getElementById('nombre').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('vive').value = '';
    document.getElementById('descargadoDesde').value = '';
    document.getElementById('culpabilidad').value = '';
    // Limpiar el input de archivo y la imagen mostrada
    document.getElementById('imageInput').value = ''; // Limpia el input de archivo
    document.getElementById('subjectImage').src = ''; // Limpia la imagen mostrada

    document.getElementById('comentarios').value = '';

    document.getElementById('subjectDetails').style.display = 'block';
    document.getElementById('subjectListContainer').style.display = 'none';
    currentEditingIndex = null; // No hay sujeto siendo editado
    document.getElementById('deleteSubjectButton').style.display = 'none'; // Oculta el botón de eliminar
    document.getElementById('cancelButton').style.display = 'block';
    currentEditingIndex = null; // No hay sujeto siendo editado
    isListVisible = false;
    lastVisibleState = 'details';
}

// Función para inicializar la aplicación
function init() {
    initializeSubjects();
    document.getElementById('toggleDisplayButton').addEventListener('click', toggleDisplay);
    // Evento para el botón 'Agregar Nuevo Sujeto'
    document.getElementById('addNewSubjectButton').addEventListener('click', openNewSubjectForm);
    // Evento para el cambio en el menú desplegable 'tipo'
    document.getElementById('tipo').addEventListener('change', handleTipoChange);
    loadSubjectsList();
}

window.onload = init;
