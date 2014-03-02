/**
* @jsx React.DOM
*/

var EquationEditor = React.createClass({displayName: 'EquationEditor',

  getDefaultProps: function() { return {
    numbers : [1,2,3,4,5,6,7,8,9,0],
    operators : '+,-,\\cdot,:'.split(','),
    variables : 'x,y,z'.split(',')
  } },

  getInitialState: function() { return {
    equations : ['x^2-2=0', 'x^2=2', 'x=\\pm \\sqrt{2}'],
    operations : ['+2', '\\sqrt{}']
  } },

  _next: function( operation ) {
    var ops = this.state.operations;
    ops.push( operation );

    this.setState( { operations : ops } );
  },

  render: function() {
    var self = this; // do with a bind?
    
    eqs = this.state.equations.map( function(e, i) {
      return Equation( {key:'equation-step-' + i, equation:e, operation:self.state.operations[i]} );
    } );

    return React.DOM.div(null, eqs, OperationBoard( {numbers:this.props.numbers, operations:this.props.operators, variables:this.props.variables, submit:this._next} ) );
  },

  componentDidUpdate: function() {
    // re-render math
    MathJax.Hub.Typeset()
  }

});

var OperationBoard = React.createClass( {displayName: 'OperationBoard',

  getInitialState : function() {
    return {
      operation : ''
    }
  },

  _operation: function(value) {
    var o = this.state.operation + value;
    this.setState( { operation : o } );
  },

  _submit: function() {
    this.props.submit( this.state.operation );
    this.setState( { operation : '' } ); 
  },

  render: function() {

    var self = this;

    var key = function(value) {
      return Keypad( {value:value, click:self._operation} );
    };

    var numbers = this.props.numbers.map( key );
    var operations = this.props.operations.map( key );
    var variables = this.props.variables.map( key );

    var current_operation = this.state.operation;

    var submit = { display: 'none' };

    if( current_operation != '' ) {
      current_operation = '$' + current_operation + '$';
      submit.display = 'inline';
    }

    return React.DOM.div(null, 
      React.DOM.div(null, current_operation, React.DOM.button( {style:submit, onClick:this._submit}, "Submit")),
      operations, numbers, variables
      )
  },

  componentDidMount: function() {
    MathJax.Hub.Typeset();
  },

  componentDidUpdate: function() {
    // re-render math
    MathJax.Hub.Typeset()
  }

});

var Keypad = React.createClass({displayName: 'Keypad',

  onClick: function() {
    this.props.click( this.props.value );
  },

  render: function() {
    return React.DOM.div( {className:'keybad-button', onClick:this.onClick} , '$' + this.props.value + '$')
  }

});

var Equation = React.createClass({displayName: 'Equation',

  render: function() {

    var operation = this.props.operation ?  '$' + this.props.operation + '$' : 'Edit this equation';

    return React.DOM.p(null, 
      React.DOM.span(null, '$' + this.props.equation + '$'), " || ",
      React.DOM.span(null, operation)
      );
  }

});

module.exports = EquationEditor;