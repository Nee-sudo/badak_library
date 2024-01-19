document.addEventListener('DOMContentLoaded', () => {
  // Initial load of the PDF list
  fetchPDFList();
});
const uploadForm = document.getElementById('uploadForm');
const pdfList = document.getElementById('pdfList');
uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(uploadForm);
  const pdfTitle = document.getElementById('pdfTitle').value; // Get the PDF title from the form
  // Remove duplicate words from the title
  formData.set('pdfTitle', pdfTitle);
  // Append the PDF title to the form data
  // formData.append('pdfTitle', pdfTitle);
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
      // Refresh the PDF list after successful upload
      fetchPDFList(); // Directly call the function
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

function fetchPDFList() {
  // Clear the current list
  pdfList.innerHTML = '';
  // Fetch the list of uploaded PDFs from the server
  fetch('/pdfs')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // Display the PDFs with their titles and open buttons
      data.forEach((pdf) => {
        const pdfBox = document.createElement('div');
        pdfBox.classList.add('pdf-box');
        const titleElement = document.createElement('h2');
        const studentName = document.createElement('h3');
        // studentName.textContent = pdf.uploaderName;
        studentName.textContent = pdf.studentname;
        titleElement.textContent = pdf.title; // Use pdf.title to display the PDF title
        const openButton = document.createElement('button');
        openButton.textContent = 'Open PDF';
        openButton.addEventListener('click', () => {
          const iframeElement = document.createElement('iframe');
          iframeElement.src = pdf.path + '#toolbar=0'; // Path from the database
          iframeElement.type = 'application/pdf';
          iframeElement.classList.add('iframeElement');
          overlay.style.display = 'block';
          popup.style.display = 'block';
          popup.appendChild(iframeElement);
        });
        iframeElement.addEventListener('error', (event) => {
        console.error('Error loading PDF:', event);
        // Handle the error, such as displaying a message to the user
});

        const embedContainer = document.createElement('div');
        embedContainer.classList.add('embed-container');
        const embedElement = document.createElement('embed');
        embedElement.src = pdf.path + '#toolbar=0'; // Path from the database
        embedElement.type = 'application/pdf';
        embedContainer.appendChild(embedElement);
        pdfBox.appendChild(titleElement);
        pdfBox.appendChild(openButton);
        pdfBox.appendChild(embedContainer);
        pdfBox.appendChild(studentName);
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
function closeform() {
  document.getElementById("uploadForm").style.display = "none";
  document.getElementById("plusbutton").style.display = "block";
}
// Popup function 
const openpopButton = document.getElementById('openButton');
const closeButton = document.getElementById('closeButton');
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
// Add event listeners for the popup close button
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
  const popclosebutton = document.createElement('button');
  popclosebutton.textContent = 'Close'; // Add your desired content
  popclosebutton.id = 'closeButton'; // Set the ID for the button
  popclosebutton.onclick = () => {
    // Define the close functionality here
    overlay.style.display = 'none';
    popup.style.display = 'none';
    resetPopupContent(); // Reset the popup content
  };
  popup.appendChild(popclosebutton);

  // You can also close the overlay here if needed
  overlay.style.display = 'none';
}
