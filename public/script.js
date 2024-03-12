document.addEventListener('DOMContentLoaded', () => {
  // Initial load of the PDF list
  fetchPDFList();
});

const uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(uploadForm);
  const pdfTitle = document.getElementById('pdfTitle').value;
  formData.set('pdfTitle', pdfTitle);
  fetch('/upload', {
      method: 'POST',
      body: formData,
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then((data) => {
      console.log(data);
      fetchPDFList();
  })
  .catch((error) => {
      console.error('Error:', error);
  });
});

function fetchPDFList() {
  const pdfList = document.getElementById('pdfList');
  pdfList.innerHTML = '';
  fetch('/pdfs')
  .then((response) => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then((data) => {
      data.forEach((pdf) => {
          const pdfBox = document.createElement('div');
          pdfBox.classList.add('pdf-box');
          const titleElement = document.createElement('h2');
          titleElement.textContent = pdf.title;
          const openButton = document.createElement('button');
          openButton.textContent = 'Open PDF';
          openButton.addEventListener('click', () => {
              window.open(`/pdf/${pdf._id}`, '_blank');
          });
          pdfBox.appendChild(titleElement);
          pdfBox.appendChild(openButton);
          pdfList.appendChild(pdfBox);
      });
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}

function openform() {
  document.getElementById("uploadForm").style.display = "block";
  document.getElementById("plusbutton").style.display = "none";
}

// Popup function 
const closeButton = document.getElementById('closeButton');
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
closeButton.addEventListener('click', () => {
  overlay.style.display = 'none';
  popup.style.display = 'none';
});
