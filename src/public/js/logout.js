const logoutButton = document.getElementById("loguotButton");

// Agrega un event listener al botón de logout
logoutButton.addEventListener("click", function () {
  // Realiza una petición POST al endpoint de logout
  fetch("/api/sessions/logout", {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        // Redirige a la página de inicio de sesión
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          title: `Cerrando sesion...`,
          icon: "success",
        });

        window.location.replace("/login");
      }
    })
    .catch((error) => {
      console.error("Error al realizar la petición:", error);
    });
});