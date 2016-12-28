$(function () {

    var note = $('.note');

    var saveTimer,
        lineHeight = parseInt(note.css('line-height')),
        minHeight = parseInt(note.css('min-height')),
        lastHeight = minHeight,
        newHeight = 0,
        newLines = 0;

    var countLinesRegex = new RegExp('\n', 'g');

    // The input event is triggered on key press-es,
    // cut/paste and even on undo/redo.

    note.on('input', function (e) {

        // Clearing the timeout prevents
        // saving on every key press
        clearTimeout(saveTimer);
        saveTimer = setTimeout(ajaxSaveNote, 2000);

        // Count the number of new lines
        newLines = note.val().match(countLinesRegex);

        if (!newLines) {
            newLines = [];
        }

        // Increase the height of the note (if needed)
        newHeight = Math.max((newLines.length + 1) * lineHeight, minHeight);

        // This will increase/decrease the height only once per change
        if (newHeight != lastHeight) {
            note.height(newHeight);
            lastHeight = newHeight;
        }
    }).trigger('input');	// This line will resize the note on page load

    function ajaxSaveNote() {
        $.getJSON('assets/json/credenciales.json',function (data) {
            Materialize.toast(data.url);
            $.ajaxSetup({
                url:data.host,
                username : data.user,
                password : data.password
            });
        });



        $.ajax({
            //url: 'https://7b836710-c941-4f17-982d-ac4b9e014565-bluemix.cloudant.com',
            data: {
                format: 'json'
            },
            error: function () {
                Materialize.toast("A ocurrido un error", 3000);
            },
            dataType: 'jsonp',
            success: function (data) {
                Materialize.toast(data.couchdb, 3000);
            },
            type: 'GET'
        });
    }
});



angular.module('editorApp', [])
    .controller('notasController', function($scope) {
        $scope.notas = [
            {titulo:'learn angular',contenido:"Contenido de la nota 1"},
            {titulo:'build an angular app', contenido:"Contenido de la nota 2"}
        ];

        $scope.addNote = function() {
            $scope.notas.push({text:$scope.todoText, done:false});
            $scope.todoText = '';
        };

        $scope.remaining = function() {
            var count = 0;
            angular.forEach($scope.notas, function(todo) {
                count++;
            });
            return count;
        };

        $scope.archive = function() {
            var oldTodos = $scope.notas;
            $scope.notas = [];
            angular.forEach(oldTodos, function(todo) {
                //if (!todo.done) notasList.notas.push(todo);
            });
        };
    });

