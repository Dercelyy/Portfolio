$(document).ready(function(){
    $.ajax({
        url: "treeView.php",
        type: "GET",
        success: function(data){
            $("#treeView").html(data);
            // Скрыть все дочерние узлы, кроме первого уровня
            $(".tree-node-header > .tree-node-children").hide();
            // Обработка нажатия на плюсик
            $(".tree-node-square").on('click', function(e) {
                e.stopPropagation();
                $(this).siblings(".tree-node-children").toggle();
            });
            // Обработка нажатия на текстовые узлы, включая Node 1 и Node 2
            $(".tree-node, .tree-node-header").on('click', function(e) {
                e.stopPropagation();
                var position = $(this).position();
                var top = position.top + $(this).outerHeight();
                var left = position.left;
                $("#confirmationModal").css({top: top, left: left}).show();
            });
            // Обработка нажатия на кнопку "Да" в модальном окне
            $("#confirmButton").on('click', function(e) {
                e.stopPropagation();
                $("#confirmationModal").hide();
            });
        }
    });
});