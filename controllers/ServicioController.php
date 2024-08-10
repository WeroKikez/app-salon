<?php 

namespace Controllers;

use MVC\Router;

class ServicioController {

    public static function index( Router $router ) {
        $router->render('servicios/index', [
            
        ]);
    }

    public static function crear( Router $router ) {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            
        }
        
        $router->render('servicios/index', [
            
        ]);
    }

    public static function actualizar( Router $router ) {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        }
        
        $router->render('servicios/index', [
            
        ]);
    }

    public static function eliminar( Router $router ) {
        $router->render('servicios/index', [
            
        ]);
    }
}