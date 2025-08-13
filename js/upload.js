const accountName = "demostorage20250808";
const containerName = "lacontainer";
const sasToken = "sp=racwdl&st=2025-08-08T04:56:12Z&se=2025-08-15T13:11:12Z&spr=https&sv=2024-11-04&sr=c&sig=WSIzl2d%2FSyKEtsrkrrAkaQePiHlmwkHYZq4XNxnyIK8%3D";
const baseUrl = `https://${accountName}.blob.core.windows.net/${containerName}`;

// Upload files
const uploadButton = document.getElementById("upload-button");
const fileInput = document.getElementById("file-input");
const uploadProgress = document.getElementById("upload-progress");

uploadButton.addEventListener("click", async () => {
    const files = fileInput.files;
    if (!files.length) {
        alert("Please select files to upload.");
        return;
    }

    uploadProgress.innerHTML = "";

    for (const file of files) {
        const uploadUrl = `${baseUrl}/${file.name}?${sasToken}`;
        try {
            const response = await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    "x-ms-blob-type": "BlockBlob",
                },
                body: file,
            });

            if (response.ok) {
                uploadProgress.innerHTML += `<p>Uploaded: ${file.name}</p>`;
            } else {
                uploadProgress.innerHTML += `<p>Failed to upload: ${file.name}</p>`;
            }
        } catch (error) {
            uploadProgress.innerHTML += `<p>Error uploading ${file.name}: ${error.message}</p>`;
        }
    }

    listFiles();
});

// List files
async function listFiles() {
    const listUrl = `${baseUrl}?restype=container&comp=list&${sasToken}`;
    const fileList = document.getElementById("file-list");
    fileList.innerHTML = "Loading...";

    try {
        const response = await fetch(listUrl);
        if (response.ok) {
            const text = await response.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, "application/xml");
            const blobs = xml.getElementsByTagName("Blob");

            fileList.innerHTML = "";
            for (const blob of blobs) {
                const name = blob.getElementsByTagName("Name")[0].textContent;
                const listItem = document.createElement("li");
                listItem.innerHTML = `${name} <button onclick="downloadFile('${name}')">Download</button>`;
                fileList.appendChild(listItem);
            }
        } else {
            fileList.innerHTML = "Failed to load file list.";
        }
    } catch (error) {
        fileList.innerHTML = `Error loading file list: ${error.message}`;
    }
}

// Download file
async function downloadFile(fileName) {
    const downloadUrl = `${baseUrl}/${fileName}?${sasToken}`;
    try {
        const response = await fetch(downloadUrl);
        if (response.ok) {
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        } else {
            alert(`Failed to download ${fileName}`);
        }
    } catch (error) {
        alert(`Error downloading ${fileName}: ${error.message}`);
    }
}

// Initial file list load
listFiles();
