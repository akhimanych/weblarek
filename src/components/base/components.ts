
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
    }

    // Набор вспомогательных методов для работы с DOM

    // Переключить состояние класса 
    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        element.classList.toggle(className, force);
    }

    // Установить текст элемента
    protected setText(element: HTMLElement | null, value: unknown): void {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Переключить блокировку элемента
    setDisabled(element: HTMLElement | null, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    // Скрыть
    protected setHidden(element: HTMLElement | null): void {
        if (element) {
            element.style.display = 'none';
        }
    }

    // Показать
    protected setVisible(element: HTMLElement | null): void {
        if (element) {
            element.style.removeProperty('display');
        }
    }

    // Задать изображение с подсказкой
    protected setImage(element: HTMLImageElement | null, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
