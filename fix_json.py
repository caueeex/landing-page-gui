import json
import re

# Estados brasileiros
ESTADOS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
           'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
           'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

def parse_entry(line):
    """Analisa uma entrada e extrai cidade, bairro, estado"""
    line = line.strip()
    if not line or line == '[' or line == ']':
        return None
    
    # Remove chaves
    content = line.strip('{}').strip()
    if not content:
        return None
    
    # Divide por vírgula, mas preserva parênteses
    parts = []
    current = ""
    paren_count = 0
    
    for char in content:
        if char == '(':
            paren_count += 1
            current += char
        elif char == ')':
            paren_count -= 1
            current += char
        elif char == ',' and paren_count == 0:
            parts.append(current.strip())
            current = ""
        else:
            current += char
    
    if current:
        parts.append(current.strip())
    
    cidade = None
    bairro = None
    estado = None
    observacao = None
    
    if len(parts) == 1:
        cidade = parts[0]
    elif len(parts) == 2:
        # Verifica se o segundo é estado
        if parts[1] in ESTADOS:
            cidade = parts[0]
            estado = parts[1]
        else:
            cidade = parts[0]
            bairro = parts[1]
    elif len(parts) == 3:
        # Verifica padrões
        if parts[1] in ESTADOS:
            # Formato: CODIGO/INSTITUIÇÃO, ESTADO, CIDADE
            observacao = parts[0]
            estado = parts[1]
            cidade = parts[2]
        elif parts[2] in ESTADOS:
            # Formato: CIDADE, BAIRRO, ESTADO
            cidade = parts[0]
            bairro = parts[1]
            estado = parts[2]
        else:
            # Sem estado identificado
            cidade = parts[0]
            bairro = parts[1]
            observacao = parts[2]
    elif len(parts) == 4:
        # Formato: CIDADE, BAIRRO, ESTADO, OBSERVAÇÃO
        cidade = parts[0]
        bairro = parts[1]
        estado = parts[2]
        observacao = parts[3]
    
    if cidade:
        result = {
            "cidade": cidade,
            "bairro": bairro if bairro else None,
            "estado": estado if estado else None
        }
        if observacao:
            result["observacao"] = observacao
        return result
    
    return None

# Ler o arquivo atual (que já foi parcialmente convertido)
# Vamos recriar a partir do formato original
# Mas primeiro, vamos ler o que temos e tentar corrigir

print("Script criado. Execute para processar o arquivo.")

