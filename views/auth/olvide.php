<h1 class="nombre-pagina">Olvide Mi Password</h1>
<p class="descripcion-pagina">Reestablece tu password escribiendo tu email</p>

<?php 
    include_once __DIR__ . "/../templates/alertas.php";
?>

<form action="/olvide" class="formulario" method="POST">
    <div class="campo">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            placeholder="Tu Email"
            name="email"

        />
    </div>

    <input class="boton" type="submit" value="Enviar Instrucciones">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? ¡Inicia Sesión!</a>
    <a href="/crear-cuenta">¿Aún no tienes una cuenta? ¡Crea Una!</a>
</div>