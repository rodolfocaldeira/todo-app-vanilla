(function(window, undefined) {

    /**
     * The Todo constructor.
     * @param goal {String} indicating the todo goal
     * @param isDone {Boolean} indicating if the task is done or not
     * @constructor
     */
    function Todo(goal, isDone) {
        this.goal = goal || "";
        this.isDone = isDone || false;
    }

    /**
     * The Todo view.
     * Renders a Todo using the DOM api.
     * @type {Object}
     */
    var todoView = {
        render : function(todo) {
            var li = document.createElement('li');
            li.className = 'clearfix';

            li.appendChild(this._createCheckbox(todo));
            li.appendChild(this._createLabel(todo));
            li.appendChild(this._createActions(todo));
            li.appendChild(this._createInput(todo));

            return li;
        },

        _createCheckbox : function(todo) {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'js-toggle';
            checkbox.addEventListener('change', function() {
                todo.isDone = !todo.isDone;
                app.refresh();
            });
            checkbox.checked = todo.isDone;
            return checkbox;
        },

        _createLabel : function(todo) {
            var label = document.createElement('label');
            label.appendChild(document.createTextNode(todo.goal));
            label.addEventListener('click', function() {
                todo.isDone = !todo.isDone;
                app.refresh();
            });
            return label;
        },

        _createAction : function(cls, clickHandler) {
            var a = document.createElement('a');
            a.className = 'js-' + cls;
            a.title = cls;
            a.href = '#';

            var icon = document.createElement('i');
            icon.className = 'icon-' + cls;
            var span = document.createElement('span');
            span.appendChild(document.createTextNode(cls));
            span.className = 'visuallyhidden';

            a.appendChild(icon);
            a.appendChild(span);

            a.addEventListener('click', clickHandler);

            return a;
        },

        _createActions : function(todo) {
            var actions = document.createElement('div');
            actions.className = 'todo-item-actions';

            actions.appendChild(this._createAction('edit', function(event) {
                var closest = event.target.parentNode.parentNode,
                    input = closest.nextSibling;

                closest = closest.parentNode;
                window.y = event;
                closest.className += ' is-edit-mode';
                input.focus();
            }));

            actions.appendChild(
                this._createAction('delete', function() {
                    app.removeTodo(todo);
                    app.refresh();
                })
            );

            return actions;
        },

        _createInput : function(todo) {
            var input = document.createElement('input');
            input.className = 'todo-edit';
            input.value = todo.goal;

            input.addEventListener('blur', function(event) {
                event.target.parentNode.className = 'clearfix';
            });
            input.addEventListener('keypress', function(event) {
                var goal = event.target.value.trim();
                if(event.keyCode === 13 && goal !== "") {
                    todo.goal = goal;
                    app.refresh();
                }
            });

            return input;
        }
    };

    /**
     * The Todo Application.
     * @type {Object}
     */
    var app = {

        // variables
        localStorage : 'little-big-todo-app',
        todos        : [],
        $create      : document.getElementById('todo-create'),
        $todos       : document.getElementById('todo-main-list'),

        /**
         * Events
         */
        bind : function() {
            this.$create.addEventListener('keypress', this.createTodo, false);
        },

        /**
         * Creates a new todo based on the user input
         * adds the todo to the list and refreshes the UI.
         * @param event
         */
        createTodo : function(event) {
            var goal = app.$create.value.trim();
            if(event.keyCode === 13 && goal !== "") {
                app.todos.push(new Todo(goal, false));
                app.$create.value = '';
                app.refresh();
            }
        },

        /**
         * Returns the index of the given todo
         * if it exists in the todos array,
         * -1 otherwise.
         * @param {Todo} todo to search
         * @return {Number} index of the todo
         */
        getTodoIndex : function(todo) {
            var len = this.todos.length,
                i;

            for(i = 0; i < len; i++) {
                if(this.todos[i] === todo) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * Removes the given todo from the todos array
         * and refreshes the UI.
         * Returns true if the todo has been removed, false otherwise.
         * @param {Todo} todo
         * @return {Boolean} indicating if the todo has been removed
         */
        removeTodo : function(todo) {
            var idx = this.getTodoIndex(todo);
            if(idx !== -1) {
                this.todos.splice(idx, 1);
                return true;
            }
            return false;
        },

        /**
         * Saves the todos array to the
         * localStorage and renders the UI.
         */
        refresh : function() {
            this.save();
            this.render();
        },

        /**
         * Persists the todos data to the local storage.
         */
        save : function() {
            localStorage.setItem(
                this.localStorage,
                JSON.stringify(this.todos)
            );
        },

        /**
         * Loads the todos array from the local storage.
         */
        load : function() {
            var storage = localStorage.getItem(this.localStorage);
            if(storage) {
                this.todos = JSON.parse(storage);
            }
        },

        /**
         * Renders the todos to the UI.
         */
        render : function() {
            var len = this.todos.length,
                i;

            app.$todos.innerHTML = '';
            for(i = 0; i < len; i++) {
                app.$todos.appendChild(todoView.render(this.todos[i]));
            }
        },

        /**
         * Initializes the application.
         */
        init : function() {
            this.bind();
            this.load();
            this.render();
        }

    };

    app.init();

    window.App = app;

})(window);