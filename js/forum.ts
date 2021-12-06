import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import ReplyComposer from 'flarum/forum/components/ReplyComposer';

app.initializers.add('mobile-reply', () => {
    // Automatically open composer when visiting a discussion page
    // Flarum already takes care of closing unused composers when leaving the page
    extend(DiscussionPage.prototype, 'show', function (returnValue: never, discussion: any) {
        if (app.screen() === 'phone' && discussion.canReply() && !app.composer.composingReplyTo(discussion)) {
            app.composer.load(ReplyComposer, {
                user: app.session.user,
                discussion,
            });
            app.composer.show();
            app.composer.minimize();
        }
    });

    // Change composer title to better reflect the fact it's a reply
    extend(ReplyComposer.prototype, 'headerItems', function (this: ReplyComposer, items: ItemList) {
        const discussion = this.attrs.discussion;

        if (items.has('title')) {
            // Change the text content of h3 > Link
            items.get('title').children[2].children = [
                'Reply to ',
                m('em', discussion.title()),
            ];
        }
    });
});
