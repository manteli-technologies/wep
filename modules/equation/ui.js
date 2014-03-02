/**
* @jsx React.DOM
*/

var math = require('../../libs/nerdamer/nerdamer-0.4.4.js').math();

_simplify = function( s1, s2 ) {
  var latex = {'\\cdot' : '*'};

  console.log( s1 );

  // clean latex
  for( value in latex ) {
    s1 = s1.replace( /value/g , latex[value] );
    s2 = s2.replace( /value/g , latex[value] );
  }

  var solved = math.addEquation( "(" + s1 + ")" + s2 ).equation;

  return solved;
}

var EquationEditor = React.createClass({

  getDefaultProps: function() { return {
    numbers : [1,2,3,4,5,6,7,8,9,0],
    operators : '+,-,\\cdot,:'.split(','),
    variables : 'x,y,z'.split(',')
  } },

  getInitialState: function() { return {
    equations : ['3 \\cdot x-2=x'],
    operations : []
  } },

  _next: function( operation ) {
    var ops = this.state.operations;
    ops.push( operation );

    this.setState( { operations : ops } );
  },

  render: function() {
    var self = this; // do with a bind?
    
    eqs = this.state.equations.map( function(e, i) {
      return <Equation key={'equation-step-' + i} equation={e} operation={self.state.operations[i]} />
    } );

    return <div>
              {eqs}
              <OperationBoard numbers={this.props.numbers} operations={this.props.operators} variables={this.props.variables} submit={this._next} />
            </div>
  },

  componentDidUpdate: function() {
    // re-render math
    MathJax.Hub.Typeset();
  },

  componentDidMount: function() {
    MathJax.Hub.Config({
      tex2jax : {inlineMath:[['$','$']] }
    });

    console.log( _simplify("3*x+3", "/3") );
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

    return <div>
            <div>{current_operation}</div>
            <button style={submit} onClick={this._submit}>"Submit"</button>
            {operations}
            {numbers}
            {variables}
          </div>
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
    return <div className='keybad-button' onClick={this.onClick}> {'$' + this.props.value + '$'}</div>
  }
});

var Equation = React.createClass({displayName: 'Equation',

  render: function() {

    var operation = this.props.operation ?  '$' + this.props.operation + '$' : 'Edit this equation';

    return <p>
      {'\$' + this.props.equation + '\$'} || {operation}
      </p>
  }

});

module.exports = EquationEditor;