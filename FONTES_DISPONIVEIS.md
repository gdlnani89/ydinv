# 🎨 Opções de Fontes Sofisticadas

## Fontes Disponíveis

### 1. **Inter** (Atualmente Ativa) ⭐
- **Características**: Moderna, clean, excelente legibilidade
- **Ideal para**: Aplicativos financeiros, interfaces modernas
- **Pesos**: 300, 400, 500, 600, 700

### 2. **Poppins** (Elegante)
- **Características**: Elegante, moderna, amigável
- **Ideal para**: Apps com foco em UX amigável
- **Pesos**: 300, 400, 500, 600, 700

### 3. **Nunito** (Suave)
- **Características**: Suave, arredondada, amigável
- **Ideal para**: Apps com tom mais casual
- **Pesos**: 300, 400, 500, 600, 700

### 4. **Montserrat** (Profissional)
- **Características**: Profissional, clean, corporativa
- **Ideal para**: Apps empresariais, financeiros
- **Pesos**: 300, 400, 500, 600, 700

## Como Alternar a Fonte

### Passo 1: Editar `index.html`
Comente a fonte atual e descomente a desejada:

```html
<!-- Atual (Inter) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Para usar Poppins -->
<!-- <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"> -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Passo 2: Editar `src/style.css`
Atualize as variáveis CSS:

```css
:root {
  /* Para Inter */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Para Poppins */
  --font-family-primary: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Para Nunito */
  --font-family-primary: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Para Montserrat */
  --font-family-primary: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

## Classes de Tipografia Disponíveis

### Títulos
- `.heading-1` - Título principal (2.5rem)
- `.heading-2` - Título secundário (2rem)
- `.heading-3` - Título terciário (1.5rem)
- `.heading-4` - Título quaternário (1.25rem)

### Texto
- `.body-large` - Texto grande (1.125rem)
- `.body-medium` - Texto médio (1rem)
- `.body-small` - Texto pequeno (0.875rem)
- `.caption` - Legenda (0.75rem, uppercase)

## Recomendação

Para um app financeiro como o Ydin, recomendo:
1. **Inter** - Para um visual moderno e profissional
2. **Montserrat** - Para um visual mais corporativo
3. **Poppins** - Para um visual mais amigável

A fonte **Inter** está atualmente ativa e é uma excelente escolha para aplicativos financeiros modernos. 