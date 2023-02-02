const containerdiv = document.querySelector(".container");
const inputTag = document.querySelector("#fileUpload");
const handleFileUpload = async () => {
    const response = await fetch("http://localhost:3000/fileUpload", {
        method: "POST",
        body: inputTag.files[0],
    });
    const data = await response.json();//from server to client

    const successDiv = document.createElement("div");
    successDiv.classList.add("success");
    successDiv.innerHTML = data;
    containerdiv.append(successDiv);
}