<?php
/**
 * @package Dallinge_Animate
 * @version 1.0.0
 */
/*
Plugin Name: Dallinge Animate
Description: A set of cool animation to integrate in your website
Author: Laetitia Dallinge
Version: 1.0.0
Author URI: http://dev.dallinge.ch/
*/
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}




function dallinge_animate_load_my_scripts()
{

    if (!function_exists('dallinge_scss_register_file')) {
        return;
    }

    dallinge_scss_register_file(plugin_dir_path(__FILE__) . 'dallinge-animate.scss');
    wp_enqueue_script('jquery');
    //wp_enqueue_script('dallinge_animate_script', plugin_dir_url(__FILE__) . 'dallinge-animate.js', array(), 16);
}

add_action('wp_enqueue_scripts', 'dallinge_animate_load_my_scripts');

