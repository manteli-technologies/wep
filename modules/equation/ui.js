/**
* @jsx React.DOM
*/

var math = require('../../libs/nerdamer/nerdamer-0.4.4.js').math();

_simplify = function( left, right, op ) {
  var latex = {'\\cdot' : '*'};

  // clean latex
  /*for( value in latex ) {
    s1 = s1.replace( /value/g , latex[value] );
    s2 = s2.replace( /value/g , latex[value] );
  }*/

  left = math.addEquation( "(" + left + ")" + op ).equation;
  right = math.addEquation( "(" + right + ")" + op ).equation;

  return left + "=" + right;
}

var EquationEditor = React.createClass({

  getDefaultProps: function() { return {
    numbers : [1,2,3,4,5,6,7,8,9,0],
    operators : '+,-,*,/'.split(','),
    variables : 'x,y,z'.split(',')
  } },

  getInitialState: function() { return {
    equations : ['3 * x-2=x'],
    operations : []
  } },

  _next: function( operation ) {
    var ops = this.state.operations;
    ops.push( operation );

    var equations = this.state.equations;

    var equation = equations[ equations.length - 1 ].split('=');
    equation = _simplify( equation[0], equation[1], operation );

    equations.push( equation );

    this.setState( { operations : ops, equations : equations } );
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
            <button style={submit} onClick={this._submit}>Submit</button>
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

    var style = {
      width: '25px',
      height: '25px',
      border: '2px solid blue',
      float: 'left',
      'margin-right': '5px'
    };

    return <div className='keybad-button' style={style} onClick={this.onClick}> {'$' + this.props.value + '$'}</div>
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