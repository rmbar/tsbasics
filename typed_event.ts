/**
 * MIT LICENSE
 *
 * Copyright 2019 rmbar
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * An event to which listeners may subscribe in order to receive a notification when any future occurrence of the event
 * happens.
 *
 * When an occurrence of the event happens the event is said to "fire".  Upon firing every listener subscribed to the
 * event at the time of firing will be notified (once per subscription) via an invocation of the registered listener
 * function (barring any exceptions being raised by one of the listeners).  Upon firing all listeners are notified in
 * an unspecified order; however, should listener `n` raise an exception during its notification all subsequent
 * listeners `n+1`, `n+2`, ... will not receive notification of the event occurrence.
 *
 * @typeparam T The type of any data payload associated with an occurrence of the event. Upon the event firing a single
 *            instance of `T` will be passed to all listeners of the event when the listener is notified.
 */
interface TypedEvent<T>
{
    /**
     * Subscribes the given listener to the event.  Multiple invocations of this method with the same listener may
     * result in the listener receiving more than one notification of the same event occurrence.
     *
     * @param listener the callback function to invoke upon an occurrence of the event.
     */
    addListener(listener: (_:T) => void): void

    /**
     * Subscribes the given controller to the event.  Multiple invocations of this method with the same controller
     * may result in the controller receiving more than one notification of the same event occurrence.
     *
     * A controller receives notification of an occurrence of an event via invocation of its `fire(...)` method.
     *
     * `controller.fire.bind(controller)`
     *
     * @param controller the callback function to invoke upon an occurrence of the event.
     */
    addPassthroughListener(controller: TypedEventController<T>): void
}

/**
 * An event that is raised by invocation of its `fire(...)` method.
 */
interface TypedEventController<T> extends TypedEvent<T>
{
    /**
     * Declares an occurrence of the event.
     *
     * @param data any data associated with the occurrence of the event.
     */
    fire(data: T): void
}

/**
 * Creates a new `TypedEventController<T>` instance of unspecified implementation.
 *
 * @typeparam T The type of any data payload associated with an occurrence of the event.
 */
function makeTypedEventController<T>(): TypedEventController<T>
{
    return new class implements TypedEventController<T>
    {
        private readonly _listeners: Array<(_:T) => void> = [];

        // contract from super
        addListener(listener: (_:T) => void) : void
        {
            this._listeners.push(listener);
        }

        // contract from super
        addPassthroughListener(controller: TypedEventController<T>): void
        {
            this.addListener(controller.fire.bind(controller));
        }

        // contract from super
        fire(data: T)
        {
            for(let listener of this._listeners)
            {
                listener(data);
            }
        }
    }
}
