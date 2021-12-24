import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import ReplyComposer from 'flarum/forum/components/ReplyComposer';

app.initializers.add('quick-reply', () => {
    // Automatically open composer when visiting a discussion page
    // Flarum already takes care of closing unused composers when leaving the page
    extend(DiscussionPage.prototype, 'show', function (returnValue: never, discussion: any) {
        // Don't do anything if we can't reply
        // Or if we are coming back to the discussion while we kept the editor opened
        if (!discussion.canReply() || app.composer.composingReplyTo(discussion)) {
            return;
        }

        // Force a specified height
        app.composer.height = 100;

        app.composer.load(ReplyComposer, {
            user: app.session.user,
            discussion,
        });
        app.composer.show();

        if (app.screen() === 'phone') {
            app.composer.minimize();
        }
    });

    // Change composer title to better reflect the fact it's a reply
    extend(ReplyComposer.prototype, 'headerItems', function (this: ReplyComposer, items: ItemList) {
        const {discussion} = this.attrs as any;

        if (items.has('title')) {
            // Change the text content of h3 > Link
            items.get('title').children[2].children = [
                app.translator.trans('quick-reply.forum.composer.title', {
                    title: m('em', discussion.title()),
                }),
            ];
        }
    });
});
