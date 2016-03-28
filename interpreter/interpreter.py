# Interpreter for Xiimple Code

import ply.lex as lex
import ply.yacc as yacc

tokens = (
  "Whitespace",
  "Identifier",
  "Zero",
  "Integer",
  "Decimal",
  "Character",
  "SString"
)

t_Whitespace = (
  r"[ \t\r\n]+"
  )

t_Identifier = (
  r"[a-zA-Z_][a-zA-Z0-9_]*"
  )

def t_Zero(t) :
  r"0"
  t.value = 0
  return t

def t_Integer(t) :
  r"[1-9][0-9]*"
  t.value = int(t.value)
  return t

def t_Decimal(t) :
  r"([0-9]+\.[0-9]*)|(\.[0-9]+)|([1-9][0-9]*(d|D))"
  t.value = float(t.value)
  return t

def t_String(t) :
  r'"([^\\]*|\[nt\"])*"'
  t.value = t.value[1:-1]
  return t

def t_error(t) :
  raise TypeError("Unknown text '%s'" % (t.value,))

lex.lex()

text = 'alpha 0 4953 245.0 3.14 .0625 256d 25D "" "str" "\\t"'
print text
lex.input(text)
for tok in iter(lex.token, None):
  print repr(tok.type), repr(tok.value)
