import json
import re

# Ler o arquivo original (precisamos restaurar primeiro)
# Mas vamos trabalhar com a lógica de parsing

def parse_line(line):
    """Analisa uma linha e extrai cidade, bairro, estado"""
    line = line.strip()
    if not line or line == '[' or line == ']':
        return None
    
    # Remove as chaves externas
    content = line.strip('{}').strip()
    
    # Divide por vírgula
    parts = [p.strip() for p in content.split(',')]
    
    # Estados brasileiros conhecidos (siglas de 2 letras)
    estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
               'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
               'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
    
    cidade = None
    bairro = None
    estado = None
    observacao = None
    
    if len(parts) == 1:
        # Apenas cidade
        cidade = parts[0]
    elif len(parts) == 2:
        # Pode ser: CIDADE, ESTADO ou CIDADE, BAIRRO
        # Verifica se o segundo é um estado
        if parts[1] in estados:
            cidade = parts[0]
            estado = parts[1]
        else:
            # Provavelmente cidade e bairro, sem estado
            cidade = parts[0]
            bairro = parts[1]
    elif len(parts) == 3:
        # Pode ser: CIDADE, BAIRRO, ESTADO ou CODIGO, ESTADO, CIDADE
        # Verifica qual é o estado
        if parts[1] in estados:
            # Formato: CODIGO, ESTADO, CIDADE (ex: ACRECO, SP, CORDEIRÓPOLIS)
            cidade = parts[2]
            estado = parts[1]
            observacao = parts[0]  # código/instituição
        elif parts[2] in estados:
            # Formato: CIDADE, BAIRRO, ESTADO
            cidade = parts[0]
            bairro = parts[1]
            estado = parts[2]
        else:
            # Nenhum estado encontrado, assume CIDADE, BAIRRO, OBSERVAÇÃO
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
        return {
            "cidade": cidade,
            "bairro": bairro if bairro else None,
            "estado": estado if estado else None,
            "observacao": observacao if observacao else None
        }
    return None

# Ler arquivo original (vamos usar um backup ou recriar)
# Por enquanto, vamos processar o que temos
print("Script criado. Execute para converter o arquivo.")

