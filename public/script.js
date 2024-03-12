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
        
        const btncenter = document.createElement('center'); // Create center element
        const openButton = document.createElement('button');
        openButton.textContent = 'Open PDF';
        openButton.addEventListener('click', () => {
            window.open(`/pdf/${pdf._id}`, '_blank');
        });
        
        btncenter.appendChild(openButton); // Append openButton to btncenter
        
        pdfBox.appendChild(titleElement);
        pdfBox.appendChild(btncenter); // Append btncenter to pdfBox
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
  resetPopupContent(); // Reset the popup content
});

// Function to reset the popup content
function resetPopupContent() {
  popup.innerHTML = ''; // Clear the popup content
  const h2 = document.createElement('h2');
  h2.textContent = 'Pdf viewer'; // Add your desired content
  popup.appendChild(h2);

  // You can also close the overlay here if needed
  overlay.style.display = 'none';
}
